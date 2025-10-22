<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo de Pago - {{ $recibo['numero'] }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: table;
            width: 100%;
        }
        
        .logo-section {
            display: table-cell;
            vertical-align: top;
            width: 50%;
        }
        
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .company-info {
            font-size: 10px;
            color: #666;
            line-height: 1.3;
        }
        
        .receipt-info {
            display: table-cell;
            vertical-align: top;
            text-align: right;
            width: 50%;
        }
        
        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .receipt-number {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        .receipt-date {
            font-size: 11px;
            color: #666;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .info-grid {
            display: table;
            width: 100%;
        }
        
        .info-column {
            display: table-cell;
            vertical-align: top;
            width: 50%;
            padding-right: 20px;
        }
        
        .info-row {
            margin-bottom: 8px;
        }
        
        .info-label {
            font-weight: bold;
            color: #374151;
            display: inline-block;
            width: 120px;
        }
        
        .info-value {
            color: #1f2937;
        }
        
        .flights-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .flights-table th,
        .flights-table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }
        
        .flights-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        
        .passengers-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .passengers-table th,
        .passengers-table td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
            font-size: 11px;
        }
        
        .passengers-table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        
        .totals-section {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .totals-table {
            width: 100%;
            margin-top: 10px;
        }
        
        .totals-row {
            display: table-row;
        }
        
        .totals-label {
            display: table-cell;
            text-align: right;
            padding: 5px 20px 5px 0;
            font-weight: bold;
            color: #374151;
        }
        
        .totals-value {
            display: table-cell;
            text-align: right;
            padding: 5px 0;
            font-weight: bold;
            color: #1f2937;
            width: 150px;
        }
        
        .total-final {
            border-top: 2px solid #2563eb;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .total-final .totals-label,
        .total-final .totals-value {
            font-size: 16px;
            color: #2563eb;
        }
        
        .payment-method {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 15px;
            margin-top: 15px;
        }
        
        .payment-method-title {
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 8px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #6b7280;
        }
        
        .footer-note {
            margin-bottom: 10px;
            font-style: italic;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-approved {
            background-color: #dcfce7;
            color: #166534;
        }
        
        .route-info {
            font-weight: bold;
            color: #2563eb;
        }
        
        .seat-info {
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="company-name">{{ $empresa['nombre'] }}</div>
                <div class="company-info">
                    NIT: {{ $empresa['nit'] }}<br>
                    {{ $empresa['direccion'] }}<br>
                    Tel: {{ $empresa['telefono'] }}<br>
                    Email: {{ $empresa['email'] }}<br>
                    Web: {{ $empresa['web'] }}
                </div>
            </div>
            <div class="receipt-info">
                <div class="receipt-title">RECIBO DE PAGO</div>
                <div class="receipt-number">No. {{ $recibo['numero'] }}</div>
                <div class="receipt-date">
                    Fecha de emisión: {{ \Carbon\Carbon::parse($recibo['fecha_emision'])->format('d/m/Y H:i') }}<br>
                    Fecha de pago: {{ \Carbon\Carbon::parse($recibo['fecha_pago'])->format('d/m/Y H:i') }}
                </div>
            </div>
        </div>

        <!-- Información del Cliente -->
        <div class="section">
            <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
            <div class="info-grid">
                <div class="info-column">
                    <div class="info-row">
                        <span class="info-label">Nombre:</span>
                        <span class="info-value">{{ $cliente['nombre'] }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Documento:</span>
                        <span class="info-value">{{ $cliente['documento'] }}</span>
                    </div>
                </div>
                <div class="info-column">
                    <div class="info-row">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{{ $cliente['email'] }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Teléfono:</span>
                        <span class="info-value">{{ $cliente['telefono'] ?? 'No registrado' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de la Reserva -->
        <div class="section">
            <div class="section-title">INFORMACIÓN DE LA RESERVA</div>
            <div class="info-grid">
                <div class="info-column">
                    <div class="info-row">
                        <span class="info-label">Código:</span>
                        <span class="info-value">{{ $reserva['codigo'] }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Estado:</span>
                        <span class="info-value">
                            <span class="status-badge status-approved">{{ strtoupper($reserva['estado']) }}</span>
                        </span>
                    </div>
                </div>
                <div class="info-column">
                    <div class="info-row">
                        <span class="info-label">Fecha creación:</span>
                        <span class="info-value">{{ \Carbon\Carbon::parse($reserva['fecha_creacion'])->format('d/m/Y H:i') }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total pasajeros:</span>
                        <span class="info-value">{{ $reserva['total_pasajeros'] }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Información de Vuelos -->
        <div class="section">
            <div class="section-title">VUELOS RESERVADOS</div>
            <table class="flights-table">
                <thead>
                    <tr>
                        <th>Vuelo</th>
                        <th>Ruta</th>
                        <th>Fecha Salida</th>
                        <th>Hora Salida</th>
                        <th>Fecha Llegada</th>
                        <th>Hora Llegada</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vuelos as $vuelo)
                    <tr>
                        <td><strong>{{ $vuelo['codigo'] }}</strong></td>
                        <td class="route-info">
                            {{ $vuelo['origen']['codigo_iata'] }} → {{ $vuelo['destino']['codigo_iata'] }}<br>
                            <small>{{ $vuelo['origen']['ciudad'] }} → {{ $vuelo['destino']['ciudad'] }}</small>
                        </td>
                        <td>{{ \Carbon\Carbon::parse($vuelo['fecha_salida'])->format('d/m/Y') }}</td>
                        <td>{{ $vuelo['hora_salida'] }}</td>
                        <td>{{ \Carbon\Carbon::parse($vuelo['fecha_llegada'])->format('d/m/Y') }}</td>
                        <td>{{ $vuelo['hora_llegada'] }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Información de Pasajeros -->
        <div class="section">
            <div class="section-title">PASAJEROS Y ASIENTOS</div>
            <table class="passengers-table">
                <thead>
                    <tr>
                        <th>Pasajero</th>
                        <th>Documento</th>
                        <th>Asientos Asignados</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($pasajeros as $pasajero)
                    <tr>
                        <td><strong>{{ $pasajero['nombre'] }}</strong></td>
                        <td>{{ $pasajero['documento'] }}</td>
                        <td>
                            @foreach($pasajero['asientos'] as $asiento)
                                <div class="seat-info">
                                    Vuelo {{ $asiento['vuelo'] }}: Asiento {{ $asiento['numero'] }} ({{ $asiento['clase'] }})
                                </div>
                            @endforeach
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Información de Pago -->
        <div class="section">
            <div class="section-title">INFORMACIÓN DE PAGO</div>
            <div class="payment-method">
                <div class="payment-method-title">Método de Pago: {{ $pago['metodo'] }}</div>
                <div class="info-row">
                    <span class="info-label">Referencia:</span>
                    <span class="info-value">{{ $pago['referencia'] }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estado:</span>
                    <span class="info-value">
                        <span class="status-badge status-approved">{{ strtoupper($pago['estado']) }}</span>
                    </span>
                </div>
                @if($pago['datos_adicionales'])
                    @php
                        $datos = is_string($pago['datos_adicionales']) ? json_decode($pago['datos_adicionales'], true) : $pago['datos_adicionales'];
                    @endphp
                    @if($datos && is_array($datos))
                        @foreach($datos as $key => $value)
                            @if(!in_array($key, ['numero_tarjeta', 'cvv', 'password']) && $value)
                                <div class="info-row">
                                    <span class="info-label">{{ ucfirst(str_replace('_', ' ', $key)) }}:</span>
                                    <span class="info-value">{{ $value }}</span>
                                </div>
                            @endif
                        @endforeach
                    @endif
                @endif
            </div>
        </div>

        <!-- Totales -->
        <div class="totals-section">
            <div class="section-title">RESUMEN DE PAGO</div>
            <div class="totals-table">
                <div class="totals-row">
                    <div class="totals-label">Subtotal:</div>
                    <div class="totals-value">${{ number_format($totales['subtotal'], 0, ',', '.') }} {{ $totales['moneda'] }}</div>
                </div>
                <div class="totals-row">
                    <div class="totals-label">Impuestos (19%):</div>
                    <div class="totales-value">${{ number_format($totales['impuestos'], 0, ',', '.') }} {{ $totales['moneda'] }}</div>
                </div>
                <div class="totals-row total-final">
                    <div class="totals-label">TOTAL PAGADO:</div>
                    <div class="totals-value">${{ number_format($totales['total'], 0, ',', '.') }} {{ $totales['moneda'] }}</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-note">
                Este recibo es un comprobante válido de pago por los servicios de reserva de vuelos.
            </div>
            <div>
                Documento generado electrónicamente por {{ $empresa['nombre'] }} - {{ now()->format('d/m/Y H:i:s') }}
            </div>
            <div style="margin-top: 10px;">
                Para consultas o reclamos, contacte a {{ $empresa['email'] }} o {{ $empresa['telefono'] }}
            </div>
        </div>
    </div>
</body>
</html>