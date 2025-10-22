<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiquete Electrónico - {{ $tiquete['codigo_reserva'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
        }
        .codigo-reserva {
            background-color: #eff6ff;
            padding: 15px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
            font-weight: bold;
            width: 40%;
            color: #4b5563;
        }
        .info-value {
            width: 60%;
            color: #1f2937;
        }
        .vuelo-info {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
        }
        .ruta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
        }
        .ciudad {
            text-align: center;
        }
        .codigo-iata {
            font-size: 32px;
            color: #2563eb;
        }
        .ciudad-nombre {
            font-size: 14px;
            color: #6b7280;
        }
        .arrow {
            font-size: 24px;
            color: #9ca3af;
        }
        .asiento-destacado {
            background-color: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            margin: 20px 0;
        }
        .asiento-numero {
            font-size: 36px;
            font-weight: bold;
            color: #b45309;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .barcode {
            text-align: center;
            margin: 20px 0;
        }
        .barcode img {
            max-width: 200px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ AirGuider</h1>
            <p style="margin: 5px 0; color: #6b7280;">Tiquete Electrónico</p>
        </div>

        <div class="codigo-reserva">
            Código de Reserva: {{ $tiquete['codigo_reserva'] }}
        </div>

        <div class="section">
            <div class="section-title">👤 INFORMACIÓN DEL PASAJERO</div>
            <div class="info-row">
                <div class="info-label">Nombre Completo:</div>
                <div class="info-value">{{ $pasajero['nombre_completo'] }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Documento:</div>
                <div class="info-value">{{ $pasajero['tipo_documento'] }} {{ $pasajero['numero_documento'] }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Fecha de Nacimiento:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($pasajero['fecha_nacimiento'])->format('d/m/Y') }}</div>
            </div>
            @if($pasajero['es_infante'])
            <div class="info-row">
                <div class="info-label">Categoría:</div>
                <div class="info-value" style="color: #dc2626;">INFANTE (Menor de 3 años)</div>
            </div>
            @endif
        </div>

        <div class="section">
            <div class="section-title">✈️ INFORMACIÓN DEL VUELO</div>
            <div class="vuelo-info">
                <div class="info-row">
                    <div class="info-label">Código de Vuelo:</div>
                    <div class="info-value" style="font-weight: bold; font-size: 18px;">{{ $vuelo['codigo'] }}</div>
                </div>

                <div class="ruta">
                    <div class="ciudad">
                        <div class="codigo-iata">{{ $vuelo['origen']['codigo_iata'] }}</div>
                        <div class="ciudad-nombre">{{ $vuelo['origen']['ciudad'] }}<br>{{ $vuelo['origen']['pais'] }}</div>
                    </div>
                    <div class="arrow">→</div>
                    <div class="ciudad">
                        <div class="codigo-iata">{{ $vuelo['destino']['codigo_iata'] }}</div>
                        <div class="ciudad-nombre">{{ $vuelo['destino']['ciudad'] }}<br>{{ $vuelo['destino']['pais'] }}</div>
                    </div>
                </div>

                <div class="info-row">
                    <div class="info-label">Fecha de Salida:</div>
                    <div class="info-value">{{ \Carbon\Carbon::parse($vuelo['fecha_salida'])->format('d/m/Y') }} - {{ $vuelo['hora_salida'] }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Fecha de Llegada:</div>
                    <div class="info-value">{{ \Carbon\Carbon::parse($vuelo['fecha_llegada'])->format('d/m/Y') }} - {{ $vuelo['hora_llegada'] }}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Aeronave:</div>
                    <div class="info-value">{{ $vuelo['aeronave']['modelo'] }} ({{ $vuelo['aeronave']['matricula'] }})</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">💺 ASIENTO ASIGNADO</div>
            <div class="asiento-destacado">
                <div style="font-size: 14px; color: #78350f; margin-bottom: 10px;">Tu asiento es:</div>
                <div class="asiento-numero">{{ $asiento['numero'] }}</div>
                <div style="font-size: 12px; color: #78350f; margin-top: 10px; text-transform: uppercase;">Clase: {{ $asiento['clase'] }}</div>
            </div>
        </div>

        @if(isset($pago))
        <div class="section">
            <div class="section-title">💳 INFORMACIÓN DEL PAGO</div>
            <div class="info-row">
                <div class="info-label">Método de Pago:</div>
                <div class="info-value">{{ ucfirst(str_replace('_', ' ', $pago['metodo'])) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Referencia:</div>
                <div class="info-value">{{ $pago['referencia'] }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Monto Pagado:</div>
                <div class="info-value" style="font-weight: bold; color: #059669;">$ {{ number_format($pago['monto'], 2) }} COP</div>
            </div>
        </div>
        @endif

        <div class="barcode">
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 10px;">Código QR del Tiquete</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{ $tiquete['codigo_reserva'] }}" alt="QR Code">
        </div>

        <div class="footer">
            <p><strong>Importante:</strong> Presente este tiquete electrónico y su documento de identidad en el aeropuerto.</p>
            <p>Se recomienda llegar con 2 horas de anticipación para vuelos nacionales.</p>
            <p style="margin-top: 15px;">Emisión: {{ \Carbon\Carbon::parse($tiquete['fecha_emision'])->format('d/m/Y H:i') }}</p>
            <p>AirGuider - Sistema de Reservas de Vuelos | SENASOFT 2025</p>
        </div>
    </div>
</body>
</html>

