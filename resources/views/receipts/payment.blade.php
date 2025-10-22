<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recibo de Pago - {{ $recibo['numero'] }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #333; padding: 30px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header table { width: 100%; }
        .company-name { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
        .company-info { font-size: 10px; color: #666; line-height: 1.5; }
        .receipt-title { font-size: 24px; font-weight: bold; color: #1f2937; text-align: right; }
        .receipt-number { font-size: 14px; font-weight: bold; color: #2563eb; text-align: right; margin: 5px 0; }
        .receipt-date { font-size: 11px; color: #666; text-align: right; }
        .section { margin: 25px 0; }
        .section-title { font-size: 14px; font-weight: bold; color: #1f2937; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 2px solid #e5e7eb; }
        .info-table { width: 100%; }
        .info-table td { padding: 8px 0; vertical-align: top; }
        .info-label { font-weight: bold; color: #374151; width: 150px; }
        .info-value { color: #1f2937; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
        .data-table th { background-color: #f3f4f6; font-weight: bold; color: #374151; }
        .totals { background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 20px; }
        .totals-table { width: 100%; }
        .totals-table td { padding: 8px; }
        .totals-label { text-align: right; font-weight: bold; color: #374151; }
        .totals-value { text-align: right; font-weight: bold; color: #1f2937; width: 150px; }
        .total-final { border-top: 2px solid #2563eb; padding-top: 15px !important; margin-top: 15px; }
        .total-final td { font-size: 16px; color: #2563eb; }
        .payment-box { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 15px; margin: 15px 0; }
        .status-badge { background-color: #dcfce7; color: #166534; padding: 6px 15px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; display: inline-block; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <table>
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <div class="company-name">{{ $empresa['nombre'] }}</div>
                    <div class="company-info">
                        NIT: {{ $empresa['nit'] }}<br>
                        {{ $empresa['direccion'] }}<br>
                        Tel: {{ $empresa['telefono'] }}<br>
                        Email: {{ $empresa['email'] }}
                    </div>
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <div class="receipt-title">RECIBO DE PAGO</div>
                    <div class="receipt-number">No. {{ $recibo['numero'] }}</div>
                    <div class="receipt-date">
                        Fecha de emisión: {{ \Carbon\Carbon::parse($recibo['fecha_emision'])->format('d/m/Y H:i') }}<br>
                        Fecha de pago: {{ \Carbon\Carbon::parse($recibo['fecha_pago'])->format('d/m/Y H:i') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="section">
        <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
        <table class="info-table">
            <tr>
                <td class="info-label">Nombre:</td>
                <td class="info-value">{{ $cliente['nombre'] }}</td>
                <td class="info-label">Email:</td>
                <td class="info-value">{{ $cliente['email'] }}</td>
            </tr>
            <tr>
                <td class="info-label">Documento:</td>
                <td class="info-value">{{ $cliente['documento'] }}</td>
                <td class="info-label">Teléfono:</td>
                <td class="info-value">{{ $cliente['telefono'] }}</td>
            </tr>
        </table>
    </div>
    <div class="section">
        <div class="section-title">INFORMACIÓN DE LA RESERVA</div>
        <table class="info-table">
            <tr>
                <td class="info-label">Código de Reserva:</td>
                <td class="info-value" style="font-weight: bold; color: #2563eb;">{{ $reserva['codigo'] }}</td>
                <td class="info-label">Total Pasajeros:</td>
                <td class="info-value">{{ $reserva['total_pasajeros'] }}</td>
            </tr>
            <tr>
                <td class="info-label">Fecha de Reserva:</td>
                <td class="info-value">{{ \Carbon\Carbon::parse($reserva['fecha_creacion'])->format('d/m/Y H:i') }}</td>
                <td class="info-label">Estado:</td>
                <td class="info-value"><span class="status-badge">{{ strtoupper($reserva['estado']) }}</span></td>
            </tr>
        </table>
    </div>
    <div class="section">
        <div class="section-title">DETALLE DE VUELOS</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Vuelo</th>
                    <th>Ruta</th>
                    <th>Fecha/Hora Salida</th>
                    <th style="text-align: right;">Precio</th>
                    <th style="text-align: center;">Pasajeros</th>
                    <th style="text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($vuelos as $vuelo)
                <tr>
                    <td>{{ $vuelo['codigo'] }}</td>
                    <td>
                        <strong>{{ $vuelo['origen']['codigo_iata'] }}</strong>  <strong>{{ $vuelo['destino']['codigo_iata'] }}</strong><br>
                        <span style="font-size: 10px; color: #6b7280;">
                            {{ $vuelo['origen']['ciudad'] }} - {{ $vuelo['destino']['ciudad'] }}
                        </span>
                    </td>
                    <td>
                        {{ \Carbon\Carbon::parse($vuelo['fecha_salida'])->format('d/m/Y') }}<br>
                        <span style="font-size: 10px; color: #6b7280;">{{ $vuelo['hora_salida'] }}</span>
                    </td>
                    <td style="text-align: right;">${{ number_format($vuelo['precio_unitario'], 0, ',', '.') }}</td>
                    <td style="text-align: center;">{{ $vuelo['cantidad_adultos'] }}</td>
                    <td style="text-align: right; font-weight: bold;">${{ number_format($vuelo['subtotal'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    <div class="section">
        <div class="section-title">INFORMACIÓN DEL PAGO</div>
        <div class="payment-box">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 50%;">
                        <strong>Método de Pago:</strong><br>
                        <span style="font-size: 14px;">{{ $pago['metodo'] }}</span>
                    </td>
                    <td style="width: 50%;">
                        <strong>Referencia de Pago:</strong><br>
                        <span style="font-size: 14px; color: #2563eb; font-weight: bold;">{{ $pago['referencia'] }}</span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding-top: 10px;">
                        <strong>Estado:</strong> <span class="status-badge">{{ strtoupper($pago['estado']) }}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div class="totals">
        <table class="totals-table">
            <tr>
                <td class="totals-label">Subtotal:</td>
                <td class="totals-value">${{ number_format($totales['subtotal'], 0, ',', '.') }} {{ $totales['moneda'] }}</td>
            </tr>
            <tr class="total-final">
                <td class="totals-label">TOTAL:</td>
                <td class="totals-value">${{ number_format($totales['total'], 0, ',', '.') }} {{ $totales['moneda'] }}</td>
            </tr>
        </table>
    </div>
    <div class="footer">
        <p style="font-style: italic; margin-bottom: 10px;">
            Este recibo certifica el pago realizado para la reserva {{ $reserva['codigo'] }}
        </p>
        <p>{{ $empresa['nombre'] }} - {{ $empresa['web'] }}</p>
        <p>Documento generado electrónicamente el {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
