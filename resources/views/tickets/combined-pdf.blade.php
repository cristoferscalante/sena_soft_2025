<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tiquetes - Reserva {{ $reserva->codigo_unico }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', Arial, sans-serif; font-size: 12px; color: #1f2937; background: #f9fafb; }
        .page { page-break-after: always; padding: 30px; }
        .page:last-child { page-break-after: auto; }

        /* Portada */
        .cover { text-align: center; padding-top: 120px; background: white; border-radius: 12px; padding: 60px 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .cover .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
        .cover h1 { font-size: 42px; color: #1e40af; margin-bottom: 10px; letter-spacing: -1px; }
        .cover .subtitle { font-size: 16px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px; }
        .cover .code { font-size: 36px; font-weight: bold; color: #2563eb; margin: 40px 0; padding: 20px; background: #eff6ff; border-radius: 8px; }
        .cover .info { background: #f9fafb; padding: 30px; margin: 40px auto; max-width: 450px; border-radius: 12px; border: 1px solid #e5e7eb; }
        .cover .info-row { margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .cover .info-row:last-child { border-bottom: none; }
        .cover .label { font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
        .cover .value { font-size: 14px; color: #1f2937; font-weight: 600; }

        /* Tiquete */
        .ticket-wrapper { position: relative; margin: 20px 0; }
        .ticket-border-left { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: repeating-linear-gradient(to bottom, #d1d5db 0, #d1d5db 8px, transparent 8px, transparent 16px); }
        .ticket { background: white; margin-left: 10px; border-radius: 0 12px 12px 0; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; }

        .ticket-header {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            color: white;
            padding: 20px 25px;
            position: relative;
        }
        .ticket-header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            right: 0;
            height: 10px;
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 98% 50%, 96% 100%, 94% 50%, 92% 100%, 90% 50%, 88% 100%, 86% 50%, 84% 100%, 82% 50%, 80% 100%, 78% 50%, 76% 100%, 74% 50%, 72% 100%, 70% 50%, 68% 100%, 66% 50%, 64% 100%, 62% 50%, 60% 100%, 58% 50%, 56% 100%, 54% 50%, 52% 100%, 50% 50%, 48% 100%, 46% 50%, 44% 100%, 42% 50%, 40% 100%, 38% 50%, 36% 100%, 34% 50%, 32% 100%, 30% 50%, 28% 100%, 26% 50%, 24% 100%, 22% 50%, 20% 100%, 18% 50%, 16% 100%, 14% 50%, 12% 100%, 10% 50%, 8% 100%, 6% 50%, 4% 100%, 2% 50%, 0 100%);
        }
        .ticket-number { font-size: 11px; opacity: 0.9; margin-bottom: 8px; letter-spacing: 1px; }
        .ticket-code { font-size: 20px; font-weight: bold; font-family: 'Courier New', monospace; }
        .ticket-ref { position: absolute; right: 25px; top: 20px; text-align: right; }
        .ticket-ref-label { font-size: 9px; opacity: 0.75; text-transform: uppercase; }
        .ticket-ref-code { font-size: 11px; font-family: 'Courier New', monospace; margin-top: 3px; }

        .ticket-content { padding: 25px; }

        /* Secciones */
        .section { margin-bottom: 25px; }
        .section-title {
            font-size: 10px;
            font-weight: bold;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }

        .info-grid { display: table; width: 100%; }
        .info-grid-row { display: table-row; }
        .info-grid-cell { display: table-cell; padding: 10px 15px 10px 0; vertical-align: top; width: 50%; }
        .info-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px; }
        .info-value { font-size: 12px; color: #1f2937; font-weight: 600; }

        /* Ruta de vuelo */
        .flight-route {
            background: #f9fafb;
            padding: 20px;
            margin: 15px 0;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .route-container { display: table; width: 100%; }
        .route-cell { display: table-cell; vertical-align: middle; text-align: center; }
        .route-divider { display: table-cell; width: 25%; vertical-align: middle; text-align: center; }
        .route-line { height: 2px; background: #d1d5db; position: relative; }
        .route-plane { color: #9ca3af; font-size: 18px; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); }
        .city-code { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 5px; letter-spacing: -1px; }
        .city-name { font-size: 10px; color: #6b7280; }

        /* Asiento */
        .seat-section { padding-bottom: 25px; margin-bottom: 25px; border-bottom: 1px solid #e5e7eb; }
        .seat-container { display: table; width: 100%; }
        .seat-cell { display: table-cell; vertical-align: middle; }
        .seat-info { width: 60%; }
        .seat-display { width: 40%; text-align: center; }
        .seat-label { font-size: 10px; color: #6b7280; margin-bottom: 5px; }
        .seat-number {
            font-size: 48px;
            font-weight: bold;
            color: #2563eb;
            line-height: 1;
        }

        /* QR Code */
        .qr-section { text-align: center; }
        .qr-label { font-size: 9px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .qr-container {
            background: #f9fafb;
            padding: 15px;
            display: inline-block;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .qr-container img { width: 140px; height: 140px; }

        /* Línea de corte */
        .cut-line {
            padding: 15px 25px;
            background: #f9fafb;
            text-align: center;
            border-top: 2px dashed #d1d5db;
        }
        .cut-line-text { font-size: 10px; color: #9ca3af; }

        .footer {
            margin-top: 30px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            line-height: 1.6;
        }
        .footer strong { color: #1f2937; }
        .footer-divider { margin: 10px 0; }
    </style>
</head>
<body>
    <!-- Portada -->
    <div class="page">
        <div class="cover">
            <h1>AirGuider</h1>
            <p class="subtitle">Tiquetes Electrónicos</p>

            <div class="code">{{ $reserva->codigo_unico }}</div>

            <div class="info">
                <div class="info-row">
                    <span class="label">Pasajero Principal</span>
                    <span class="value">{{ $reserva->pagador->nombre_completo }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Total Tiquetes</span>
                    <span class="value">{{ count($tiquetes) }} {{ count($tiquetes) == 1 ? 'Tiquete' : 'Tiquetes' }}</span>
                </div>
                <div class="info-row">
                    <span class="label">Fecha de Emisión</span>
                    <span class="value">{{ now()->format('d/m/Y H:i') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Tiquetes -->
    @foreach($tiquetes as $index => $tiquete)
    <div class="page">
        <div class="ticket-wrapper">
            <div class="ticket-border-left"></div>

            <div class="ticket">
                <!-- Header del Tiquete -->
                <div class="ticket-header">
                    <div class="ticket-number">
                        TIQUETE {{ $index + 1 }} DE {{ count($tiquetes) }}
                    </div>
                    <div class="ticket-code">
                        {{ $tiquete['tiquete']['codigo_reserva'] }}
                    </div>
                    <div class="ticket-ref">
                        <div class="ticket-ref-label">Referencia</div>
                        <div class="ticket-ref-code">{{ $tiquete['tiquete']['codigo_reserva'] }}</div>
                    </div>
                </div>

                <div class="ticket-content">
                    <!-- Pasajero -->
                    <div class="section">
                        <div class="section-title">Pasajero</div>
                        <div class="info-grid">
                            <div class="info-grid-row">
                                <div class="info-grid-cell">
                                    <span class="info-label">Nombre</span>
                                    <span class="info-value">{{ $tiquete['pasajero']['nombre_completo'] }}</span>
                                </div>
                                <div class="info-grid-cell">
                                    <span class="info-label">Documento</span>
                                    <span class="info-value">{{ $tiquete['pasajero']['tipo_documento'] }} {{ $tiquete['pasajero']['numero_documento'] }}</span>
                                </div>
                            </div>
                            @if($tiquete['pasajero']['es_infante'])
                            <div class="info-grid-row">
                                <div class="info-grid-cell" colspan="2">
                                    <span class="info-label">Tipo de Pasajero</span>
                                    <span class="info-value" style="color: #dc2626;">⚠️ INFANTE (Menor de 3 años)</span>
                                </div>
                            </div>
                            @endif
                        </div>
                    </div>

                    <!-- Vuelo -->
                    <div class="section">
                        <div class="section-title">Vuelo</div>

                        <div style="margin-bottom: 15px;">
                            <span class="info-label">Código de Vuelo</span>
                            <span class="info-value" style="font-size: 14px;">{{ $tiquete['vuelo']['codigo'] }}</span>
                        </div>

                        <!-- Ruta -->
                        <div class="flight-route">
                            <div class="route-container">
                                <div class="route-cell" style="width: 37.5%;">
                                    <div class="city-code">{{ $tiquete['vuelo']['origen']['codigo_iata'] }}</div>
                                    <div class="city-name">{{ $tiquete['vuelo']['origen']['ciudad'] }}</div>
                                </div>
                                <div class="route-divider">
                                    <div class="route-line">
                                        <span class="route-plane">✈️</span>
                                    </div>
                                </div>
                                <div class="route-cell" style="width: 37.5%;">
                                    <div class="city-code">{{ $tiquete['vuelo']['destino']['codigo_iata'] }}</div>
                                    <div class="city-name">{{ $tiquete['vuelo']['destino']['ciudad'] }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Horarios -->
                        <div class="info-grid">
                            <div class="info-grid-row">
                                <div class="info-grid-cell">
                                    <span class="info-label">Salida</span>
                                    <span class="info-value">{{ \Carbon\Carbon::parse($tiquete['vuelo']['fecha_salida'])->format('d/m/Y') }} - {{ $tiquete['vuelo']['hora_salida'] }}</span>
                                </div>
                                <div class="info-grid-cell">
                                    <span class="info-label">Llegada</span>
                                    <span class="info-value">{{ \Carbon\Carbon::parse($tiquete['vuelo']['fecha_llegada'])->format('d/m/Y') }} - {{ $tiquete['vuelo']['hora_llegada'] }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Aeronave -->
                        <div style="margin-top: 15px;">
                            <span class="info-label">Aeronave</span>
                            <span class="info-value">{{ $tiquete['vuelo']['aeronave']['modelo'] }} ({{ $tiquete['vuelo']['aeronave']['matricula'] }})</span>
                        </div>
                    </div>

                    <!-- Asiento y QR -->
                    <div class="seat-section">
                        <div class="section-title">Asiento</div>
                        <div class="seat-container">
                            <div class="seat-cell seat-info">
                                <div class="seat-label">Tu asiento es:</div>
                                <div class="seat-number">{{ $tiquete['asiento']['numero'] }}</div>
                            </div>
                            <div class="seat-cell seat-display">
                                <div class="qr-section">
                                    <div class="qr-label">Código QR</div>
                                    <div class="qr-container">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ $tiquete['tiquete']['codigo_reserva'] }}-{{ $index + 1 }}" alt="QR">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Línea de corte -->
                <div class="cut-line">
                    <span class="cut-line-text">✂️ Línea de corte</span>
                </div>
            </div>
        </div>

        @if($index == count($tiquetes) - 1)
        <div class="footer">
            <p><strong>⚠️ Importante:</strong> Presente este tiquete y su documento de identidad en el aeropuerto.</p>
            <div class="footer-divider"></div>
            <p>📍 Llegue mínimo 2 horas antes para vuelos nacionales y 3 horas para internacionales.</p>
            <div class="footer-divider"></div>
            <p style="margin-top: 15px; font-size: 9px;">AirGuider © {{ date('Y') }} - Todos los derechos reservados</p>
        </div>
        @endif
    </div>
    @endforeach
</body>
</html>
