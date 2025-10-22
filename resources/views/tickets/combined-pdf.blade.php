<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tiquetes - Reserva {{ $reserva->codigo_unico }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
        .page { page-break-after: always; padding: 20px; }
        .page:last-child { page-break-after: auto; }
        
        /* Portada */
        .cover { text-align: center; padding-top: 100px; }
        .cover h1 { font-size: 36px; color: #2563eb; margin-bottom: 20px; }
        .cover .code { font-size: 32px; font-weight: bold; color: #1e40af; margin: 30px 0; }
        .cover .info { background: #f3f4f6; padding: 20px; margin: 30px auto; max-width: 400px; border-radius: 8px; }
        .cover .info-row { margin: 10px 0; }
        .cover .label { font-weight: bold; color: #6b7280; }
        
        /* Tiquete */
        .ticket { border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .ticket-header { background: #2563eb; color: white; padding: 15px; margin: -20px -20px 20px -20px; border-radius: 6px 6px 0 0; text-align: center; font-size: 16px; font-weight: bold; }
        
        .section { margin: 20px 0; }
        .section-title { background: #f3f4f6; padding: 8px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #2563eb; }
        
        .row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #6b7280; display: inline-block; width: 40%; }
        .value { color: #1f2937; }
        
        .route { text-align: center; margin: 20px 0; }
        .route-cities { display: flex; justify-content: space-around; align-items: center; }
        .city { text-align: center; }
        .city-code { font-size: 28px; font-weight: bold; color: #2563eb; }
        .city-name { font-size: 11px; color: #6b7280; margin-top: 5px; }
        .arrow { font-size: 24px; color: #9ca3af; margin: 0 20px; }
        
        .seat-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; text-align: center; border-radius: 8px; margin: 15px 0; }
        .seat-number { font-size: 32px; font-weight: bold; color: #b45309; }
        
        .qr { text-align: center; margin: 20px 0; }
        .qr img { width: 150px; height: 150px; }
        
        .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280; }
    </style>
</head>
<body>
    <!-- Portada -->
    <div class="page">
        <div class="cover">
            <h1>✈️ AirGuider</h1>
            <p style="font-size: 18px; color: #6b7280;">Tiquetes Electrónicos</p>
            
            <div class="code">{{ $reserva->codigo_unico }}</div>
            
            <div class="info">
                <div class="info-row">
                    <span class="label">Pasajero Principal:</span><br>
                    {{ $reserva->pagador->nombre_completo }}
                </div>
                <div class="info-row">
                    <span class="label">Total Tiquetes:</span><br>
                    {{ count($tiquetes) }}
                </div>
                <div class="info-row">
                    <span class="label">Emisión:</span><br>
                    {{ now()->format('d/m/Y H:i') }}
                </div>
            </div>
        </div>
    </div>

    <!-- Tiquetes -->
    @foreach($tiquetes as $index => $tiquete)
    <div class="page">
        <div class="ticket">
            <div class="ticket-header">
                TIQUETE {{ $index + 1 }} DE {{ count($tiquetes) }}
            </div>

            <div style="text-align: center; font-size: 20px; font-weight: bold; color: #2563eb; margin: 15px 0;">
                {{ $tiquete['tiquete']['codigo_reserva'] }}
            </div>

            <!-- Pasajero -->
            <div class="section">
                <div class="section-title">PASAJERO</div>
                <div class="row">
                    <span class="label">Nombre:</span>
                    <span class="value">{{ $tiquete['pasajero']['nombre_completo'] }}</span>
                </div>
                <div class="row">
                    <span class="label">Documento:</span>
                    <span class="value">{{ $tiquete['pasajero']['tipo_documento'] }} {{ $tiquete['pasajero']['numero_documento'] }}</span>
                </div>
                @if($tiquete['pasajero']['es_infante'])
                <div class="row">
                    <span class="label">Tipo:</span>
                    <span class="value" style="color: #dc2626;">INFANTE (Menor de 3 años)</span>
                </div>
                @endif
            </div>

            <!-- Vuelo -->
            <div class="section">
                <div class="section-title">VUELO</div>
                <div class="row">
                    <span class="label">Código:</span>
                    <span class="value" style="font-weight: bold;">{{ $tiquete['vuelo']['codigo'] }}</span>
                </div>
                
                <div class="route">
                    <table width="100%" cellpadding="10">
                        <tr>
                            <td width="40%" style="text-align: center;">
                                <div class="city-code">{{ $tiquete['vuelo']['origen']['codigo_iata'] }}</div>
                                <div class="city-name">{{ $tiquete['vuelo']['origen']['ciudad'] }}</div>
                            </td>
                            <td width="20%" style="text-align: center;">
                                <span class="arrow">→</span>
                            </td>
                            <td width="40%" style="text-align: center;">
                                <div class="city-code">{{ $tiquete['vuelo']['destino']['codigo_iata'] }}</div>
                                <div class="city-name">{{ $tiquete['vuelo']['destino']['ciudad'] }}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="row">
                    <span class="label">Salida:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($tiquete['vuelo']['fecha_salida'])->format('d/m/Y') }} - {{ $tiquete['vuelo']['hora_salida'] }}</span>
                </div>
                <div class="row">
                    <span class="label">Llegada:</span>
                    <span class="value">{{ \Carbon\Carbon::parse($tiquete['vuelo']['fecha_llegada'])->format('d/m/Y') }} - {{ $tiquete['vuelo']['hora_llegada'] }}</span>
                </div>
                <div class="row">
                    <span class="label">Aeronave:</span>
                    <span class="value">{{ $tiquete['vuelo']['aeronave']['modelo'] }} ({{ $tiquete['vuelo']['aeronave']['matricula'] }})</span>
                </div>
            </div>

            <!-- Asiento -->
            <div class="section">
                <div class="section-title">ASIENTO</div>
                <div class="seat-box">
                    <div style="font-size: 11px; color: #78350f; margin-bottom: 8px;">Tu asiento es:</div>
                    <div class="seat-number">{{ $tiquete['asiento']['numero'] }}</div>
                </div>
            </div>

            <!-- QR -->
            <div class="qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ $tiquete['tiquete']['codigo_reserva'] }}-{{ $index + 1 }}" alt="QR">
            </div>

            @if($index == count($tiquetes) - 1)
            <div class="footer">
                <p><strong>Importante:</strong> Presente este tiquete y su documento en el aeropuerto.</p>
                <p>Llegue 2 horas antes para vuelos nacionales.</p>
                <p style="margin-top: 10px;">AirGuider © {{ date('Y') }}</p>
            </div>
            @endif
        </div>
    </div>
    @endforeach
</body>
</html>