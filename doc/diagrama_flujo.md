# Diagramas de Flujo – Sistema de Compra de Tiquetes Aéreos

Documento: versión 1.0  •  Fecha: 2025-10-21

## 1. Introducción

Este documento presenta los diagramas de flujo de todas las operaciones principales del sistema de compra de tiquetes aéreos. Cada diagrama muestra el proceso paso a paso, las decisiones y los flujos alternativos para cada funcionalidad.

---

## 2. Flujo General del Sistema

Este diagrama muestra el flujo completo desde que el usuario accede al sistema hasta que obtiene sus tiquetes.

```mermaid
flowchart TD
    Start([Usuario accede al sistema]) --> Search[Búsqueda de vuelos]
    Search --> SelectFlight[Selección de vuelo]
    SelectFlight --> SelectSeats[Selección de asientos]
    SelectSeats --> PassengerData[Registro de pasajeros]
    PassengerData --> PayerData[Datos del pagador]
    PayerData --> Terms[Aceptación de términos]
    Terms --> Payment[Simulación de pago]
    Payment --> PaymentSuccess{¿Pago exitoso?}
    
    PaymentSuccess -->|Sí| GenerateTickets[Generar tiquetes]
    PaymentSuccess -->|No| PaymentFailed[Mostrar error]
    PaymentFailed --> RetryPayment{¿Reintentar?}
    RetryPayment -->|Sí| Payment
    RetryPayment -->|No| CancelReservation[Cancelar reserva]
    
    GenerateTickets --> Confirmation[Confirmación de reserva]
    Confirmation --> Download[Descarga de tiquetes]
    Download --> End([Fin])
    CancelReservation --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style PaymentSuccess fill:#FFD700
    style GenerateTickets fill:#87CEEB
```

---

## 3. Flujo de Búsqueda de Vuelos

Proceso para buscar vuelos disponibles según criterios del usuario.

```mermaid
flowchart TD
    Start([Inicio: Búsqueda]) --> InputOrigin[Usuario ingresa ciudad origen]
    InputOrigin --> AutocompleteOrigin{¿Autocompletar?}
    AutocompleteOrigin -->|Sí| ShowOriginSuggestions[Mostrar sugerencias]
    AutocompleteOrigin -->|No| InputDestination
    ShowOriginSuggestions --> SelectOrigin[Usuario selecciona ciudad]
    SelectOrigin --> InputDestination[Usuario ingresa ciudad destino]
    
    InputDestination --> AutocompleteDestination{¿Autocompletar?}
    AutocompleteDestination -->|Sí| ShowDestinationSuggestions[Mostrar sugerencias]
    AutocompleteDestination -->|No| ValidateDestination
    ShowDestinationSuggestions --> SelectDestination[Usuario selecciona ciudad]
    SelectDestination --> ValidateDestination{¿Origen ≠ Destino?}
    
    ValidateDestination -->|No| ErrorSameCity[Error: Misma ciudad]
    ValidateDestination -->|Sí| TripType[Seleccionar tipo de viaje]
    ErrorSameCity --> InputDestination
    
    TripType --> OneWay{¿Solo ida?}
    OneWay -->|Sí| SelectDepartureDate[Seleccionar fecha ida]
    OneWay -->|No| SelectDepartureDateRT[Seleccionar fechas ida y regreso]
    
    SelectDepartureDate --> ValidateDate1{¿Fecha válida?<br/>Hoy a +60 días}
    SelectDepartureDateRT --> ValidateDate2{¿Fechas válidas?<br/>Hoy a +60 días}
    
    ValidateDate1 -->|No| ErrorDate1[Error: Fecha inválida]
    ValidateDate1 -->|Sí| SelectPassengers
    ValidateDate2 -->|No| ErrorDate2[Error: Fechas inválidas]
    ValidateDate2 -->|Sí| SelectPassengers
    
    ErrorDate1 --> SelectDepartureDate
    ErrorDate2 --> SelectDepartureDateRT
    
    SelectPassengers[Seleccionar cantidad pasajeros<br/>1-5] --> ValidatePassengers{¿1 ≤ pasajeros ≤ 5?}
    ValidatePassengers -->|No| ErrorPassengers[Error: Máx. 5 pasajeros]
    ValidatePassengers -->|Sí| SearchAPI[Enviar búsqueda a API]
    ErrorPassengers --> SelectPassengers
    
    SearchAPI --> LoadingState[Mostrar estado de carga]
    LoadingState --> APIResponse{¿Respuesta exitosa?}
    
    APIResponse -->|No| ErrorAPI[Error: Problema servidor]
    APIResponse -->|Sí| CheckResults{¿Hay vuelos?}
    ErrorAPI --> RetrySearch{¿Reintentar?}
    RetrySearch -->|Sí| SearchAPI
    RetrySearch -->|No| End
    
    CheckResults -->|No| NoFlights[No hay vuelos disponibles]
    CheckResults -->|Sí| ShowResults[Mostrar lista de vuelos]
    NoFlights --> ModifySearch{¿Modificar búsqueda?}
    ModifySearch -->|Sí| InputOrigin
    ModifySearch -->|No| End
    
    ShowResults --> FilterSort[Usuario filtra/ordena<br/>Opcional]
    FilterSort --> UserSelects[Usuario selecciona vuelo(s)]
    UserSelects --> End([Fin: Vuelo seleccionado])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorSameCity fill:#FF6B6B
    style ErrorDate1 fill:#FF6B6B
    style ErrorDate2 fill:#FF6B6B
    style ErrorPassengers fill:#FF6B6B
    style ErrorAPI fill:#FF6B6B
    style ShowResults fill:#87CEEB
```

---

## 4. Flujo de Selección de Vuelo

Proceso para seleccionar uno o dos vuelos (ida/regreso) y verificar disponibilidad.

```mermaid
flowchart TD
    Start([Inicio: Selección]) --> DisplayFlights[Mostrar vuelos disponibles]
    DisplayFlights --> TripType{¿Tipo de viaje?}
    
    TripType -->|Solo ida| SelectOutbound[Usuario selecciona vuelo ida]
    TripType -->|Ida y regreso| SelectOutbound2[Usuario selecciona vuelo ida]
    
    SelectOutbound --> CheckCapacity1{¿Capacidad suficiente?}
    SelectOutbound2 --> CheckCapacity2{¿Capacidad suficiente?}
    
    CheckCapacity1 -->|No| ErrorNoSeats1[Error: Sin asientos<br/>para pasajeros]
    CheckCapacity1 -->|Sí| ShowFlightDetails1[Mostrar detalles vuelo]
    
    CheckCapacity2 -->|No| ErrorNoSeats2[Error: Sin asientos]
    CheckCapacity2 -->|Sí| SelectReturn[Usuario selecciona vuelo regreso]
    
    ErrorNoSeats1 --> DisplayFlights
    ErrorNoSeats2 --> SelectOutbound2
    
    SelectReturn --> CheckCapacityReturn{¿Capacidad suficiente?}
    CheckCapacityReturn -->|No| ErrorNoSeatsReturn[Error: Sin asientos]
    CheckCapacityReturn -->|Sí| ShowFlightDetails2[Mostrar detalles ambos vuelos]
    ErrorNoSeatsReturn --> SelectReturn
    
    ShowFlightDetails1 --> CalculateTotal1[Calcular precio total]
    ShowFlightDetails2 --> CalculateTotal2[Calcular precio total]
    
    CalculateTotal1 --> ConfirmSelection1[Usuario confirma selección]
    CalculateTotal2 --> ConfirmSelection2[Usuario confirma selección]
    
    ConfirmSelection1 --> SaveToSession1[Guardar en sesión/estado]
    ConfirmSelection2 --> SaveToSession2[Guardar en sesión/estado]
    
    SaveToSession1 --> End([Fin: Continuar a asientos])
    SaveToSession2 --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorNoSeats1 fill:#FF6B6B
    style ErrorNoSeats2 fill:#FF6B6B
    style ErrorNoSeatsReturn fill:#FF6B6B
    style ShowFlightDetails1 fill:#87CEEB
    style ShowFlightDetails2 fill:#87CEEB
```

---

## 5. Flujo de Selección de Asientos

Proceso crítico que incluye control de concurrencia para evitar doble reserva.

```mermaid
flowchart TD
    Start([Inicio: Selección asientos]) --> LoadSeats[Cargar mapa de asientos<br/>GET /api/flights/:id/seats]
    LoadSeats --> LoadSuccess{¿Carga exitosa?}
    
    LoadSuccess -->|No| ErrorLoad[Error: No se pudo cargar]
    LoadSuccess -->|Sí| ShowSeatMap[Mostrar mapa interactivo]
    ErrorLoad --> RetryLoad{¿Reintentar?}
    RetryLoad -->|Sí| LoadSeats
    RetryLoad -->|No| End
    
    ShowSeatMap --> CheckPassengers{¿Vuelos múltiples?}
    CheckPassengers -->|Ida solamente| SelectSeatsOutbound[Seleccionar asientos<br/>para vuelo ida]
    CheckPassengers -->|Ida y regreso| SelectSeatsOutbound2[Seleccionar asientos<br/>vuelo ida]
    
    SelectSeatsOutbound --> CountSeats1{¿Asientos = pasajeros?}
    SelectSeatsOutbound2 --> CountSeats2{¿Asientos = pasajeros?}
    
    CountSeats1 -->|No| ErrorCount1[Error: Debe seleccionar<br/>asientos para todos]
    CountSeats1 -->|Sí| ValidateAvailability1[Verificar disponibilidad]
    ErrorCount1 --> SelectSeatsOutbound
    
    CountSeats2 -->|No| ErrorCount2[Error: Completar selección]
    CountSeats2 -->|Sí| SelectSeatsReturn[Seleccionar asientos<br/>vuelo regreso]
    ErrorCount2 --> SelectSeatsOutbound2
    
    SelectSeatsReturn --> CountSeatsReturn{¿Asientos = pasajeros?}
    CountSeatsReturn -->|No| ErrorCountReturn[Error: Completar selección]
    CountSeatsReturn -->|Sí| ValidateAvailability2[Verificar disponibilidad]
    ErrorCountReturn --> SelectSeatsReturn
    
    ValidateAvailability1 --> ReserveSeats1[POST /api/seats/reserve<br/>Intentar reservar asientos]
    ValidateAvailability2 --> ReserveSeats2[POST /api/seats/reserve<br/>Intentar reservar todos asientos]
    
    ReserveSeats1 --> LockAttempt1{¿Lock exitoso?}
    ReserveSeats2 --> LockAttempt2{¿Lock exitoso?}
    
    LockAttempt1 -->|No| Conflict1[409 Conflict<br/>Asiento(s) tomados]
    LockAttempt1 -->|Sí| BeginTransaction1[BEGIN TRANSACTION]
    
    LockAttempt2 -->|No| Conflict2[409 Conflict<br/>Asiento(s) tomados]
    LockAttempt2 -->|Sí| BeginTransaction2[BEGIN TRANSACTION]
    
    Conflict1 --> RefreshMap1[Refrescar mapa]
    Conflict2 --> RefreshMap2[Refrescar mapa]
    RefreshMap1 --> SelectSeatsOutbound
    RefreshMap2 --> SelectSeatsOutbound2
    
    BeginTransaction1 --> UpdateDB1[UPDATE asientos<br/>SET estado='reservado']
    BeginTransaction2 --> UpdateDB2[UPDATE asientos<br/>SET estado='reservado']
    
    UpdateDB1 --> CommitTx1[COMMIT TRANSACTION]
    UpdateDB2 --> CommitTx2[COMMIT TRANSACTION]
    
    CommitTx1 --> Success1{¿Commit exitoso?}
    CommitTx2 --> Success2{¿Commit exitoso?}
    
    Success1 -->|No| Rollback1[ROLLBACK]
    Success1 -->|Sí| SetTimer1[Iniciar timer 5 min<br/>TTL de reserva]
    
    Success2 -->|No| Rollback2[ROLLBACK]
    Success2 -->|Sí| SetTimer2[Iniciar timer 5 min<br/>TTL de reserva]
    
    Rollback1 --> ErrorDB1[Error: Problema BD]
    Rollback2 --> ErrorDB2[Error: Problema BD]
    ErrorDB1 --> RetryReserve1{¿Reintentar?}
    ErrorDB2 --> RetryReserve2{¿Reintentar?}
    RetryReserve1 -->|Sí| ReserveSeats1
    RetryReserve1 -->|No| End
    RetryReserve2 -->|Sí| ReserveSeats2
    RetryReserve2 -->|No| End
    
    SetTimer1 --> SaveSelection1[Guardar selección en sesión]
    SetTimer2 --> SaveSelection2[Guardar selección en sesión]
    
    SaveSelection1 --> ShowConfirmation1[Mostrar confirmación]
    SaveSelection2 --> ShowConfirmation2[Mostrar confirmación]
    
    ShowConfirmation1 --> End([Fin: Continuar a pasajeros])
    ShowConfirmation2 --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style Conflict1 fill:#FFA500
    style Conflict2 fill:#FFA500
    style ErrorLoad fill:#FF6B6B
    style ErrorDB1 fill:#FF6B6B
    style ErrorDB2 fill:#FF6B6B
    style SetTimer1 fill:#87CEEB
    style SetTimer2 fill:#87CEEB
```

---

## 6. Flujo de Registro de Pasajeros

Captura de datos de hasta 5 pasajeros con validaciones.

```mermaid
flowchart TD
    Start([Inicio: Registro pasajeros]) --> InitForm[Mostrar formulario<br/>pasajero 1]
    InitForm --> PassengerLoop{¿Pasajero número?}
    
    PassengerLoop --> InputData[Usuario ingresa datos:<br/>- Apellidos<br/>- Nombres<br/>- Fecha nacimiento<br/>- Género<br/>- Tipo/Número documento<br/>- ¿Es infante?<br/>- Celular<br/>- Correo]
    
    InputData --> ValidateRequired{¿Campos obligatorios<br/>completos?}
    ValidateRequired -->|No| ErrorRequired[Error: Completar campos]
    ValidateRequired -->|Sí| ValidateEmail{¿Email válido?}
    ErrorRequired --> InputData
    
    ValidateEmail -->|No| ErrorEmail[Error: Email inválido]
    ValidateEmail -->|Sí| ValidatePhone{¿Teléfono válido?}
    ErrorEmail --> InputData
    
    ValidatePhone -->|No| ErrorPhone[Error: Teléfono inválido]
    ValidatePhone -->|Sí| ValidateDocument{¿Documento válido?}
    ErrorPhone --> InputData
    
    ValidateDocument -->|No| ErrorDocument[Error: Documento inválido]
    ValidateDocument -->|Sí| ValidateBirthdate{¿Fecha nacimiento<br/>válida?}
    ErrorDocument --> InputData
    
    ValidateBirthdate -->|No| ErrorBirthdate[Error: Fecha inválida]
    ValidateBirthdate -->|Sí| CheckInfant{¿Marcado como infante?}
    ErrorBirthdate --> InputData
    
    CheckInfant -->|Sí| ValidateInfantAge{¿Edad < 3 años?}
    CheckInfant -->|No| SavePassenger
    
    ValidateInfantAge -->|No| ErrorInfantAge[Error: Infante debe<br/>ser menor de 3 años]
    ValidateInfantAge -->|Sí| SavePassenger[Guardar datos pasajero]
    ErrorInfantAge --> InputData
    
    SavePassenger --> PassengerCount{¿Total pasajeros?}
    PassengerCount -->|< Cantidad requerida| AskAddMore{¿Agregar otro?}
    PassengerCount -->|= Cantidad requerida| AllComplete[Todos completos]
    PassengerCount -->|> 5| ErrorMaxPassengers[Error: Máx. 5 pasajeros]
    
    AskAddMore -->|Sí| InitForm
    AskAddMore -->|No| ErrorIncomplete[Error: Faltan pasajeros]
    ErrorMaxPassengers --> End
    ErrorIncomplete --> InitForm
    
    AllComplete --> ReviewData[Mostrar resumen<br/>de todos los pasajeros]
    ReviewData --> UserConfirms{¿Usuario confirma?}
    
    UserConfirms -->|No| EditPassenger[Editar datos]
    UserConfirms -->|Sí| AssignSeats[Asignar asientos<br/>a pasajeros]
    EditPassenger --> PassengerLoop
    
    AssignSeats --> ValidateAssignment{¿Todos asignados?}
    ValidateAssignment -->|No| ErrorAssignment[Error: Asignar todos]
    ValidateAssignment -->|Sí| SaveToSession[Guardar en sesión]
    ErrorAssignment --> AssignSeats
    
    SaveToSession --> End([Fin: Continuar a pagador])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorRequired fill:#FF6B6B
    style ErrorEmail fill:#FF6B6B
    style ErrorPhone fill:#FF6B6B
    style ErrorDocument fill:#FF6B6B
    style ErrorBirthdate fill:#FF6B6B
    style ErrorInfantAge fill:#FF6B6B
    style ErrorMaxPassengers fill:#FF6B6B
    style ReviewData fill:#87CEEB
```

---

## 7. Flujo de Datos del Pagador y Términos

Captura de información del pagador y aceptación de términos y condiciones.

```mermaid
flowchart TD
    Start([Inicio: Datos pagador]) --> ShowForm[Mostrar formulario pagador]
    ShowForm --> InputPayerData[Usuario ingresa:<br/>- Nombre completo<br/>- Tipo documento<br/>- Número documento<br/>- Correo electrónico<br/>- Teléfono]
    
    InputPayerData --> ValidateRequiredFields{¿Campos completos?}
    ValidateRequiredFields -->|No| ErrorRequired[Error: Completar todos]
    ValidateRequiredFields -->|Sí| ValidatePayerEmail{¿Email válido?}
    ErrorRequired --> InputPayerData
    
    ValidatePayerEmail -->|No| ErrorPayerEmail[Error: Email inválido]
    ValidatePayerEmail -->|Sí| ValidatePayerPhone{¿Teléfono válido?}
    ErrorPayerEmail --> InputPayerData
    
    ValidatePayerPhone -->|No| ErrorPayerPhone[Error: Teléfono inválido]
    ValidatePayerPhone -->|Sí| ValidatePayerDocument{¿Documento válido?}
    ErrorPayerPhone --> InputPayerData
    
    ValidatePayerDocument -->|No| ErrorPayerDocument[Error: Documento inválido]
    ValidatePayerDocument -->|Sí| SavePayerData[Guardar datos pagador]
    ErrorPayerDocument --> InputPayerData
    
    SavePayerData --> ShowTerms[Mostrar términos y condiciones]
    ShowTerms --> UserReadsTerms[Usuario lee términos]
    UserReadsTerms --> AcceptTerms{¿Usuario acepta?}
    
    AcceptTerms -->|No| CannotContinue[No puede continuar sin aceptar]
    AcceptTerms -->|Sí| SaveAcceptance[Guardar aceptación<br/>con timestamp]
    CannotContinue --> ShowTerms
    
    SaveAcceptance --> ShowSummary[Mostrar resumen completo:<br/>- Vuelos<br/>- Pasajeros<br/>- Asientos<br/>- Pagador<br/>- Total a pagar]
    
    ShowSummary --> UserReviewsSummary{¿Confirmar datos?}
    UserReviewsSummary -->|No| OfferEdit[Ofrecer editar]
    UserReviewsSummary -->|Sí| SaveToSession[Guardar en sesión]
    
    OfferEdit --> WhatToEdit{¿Qué editar?}
    WhatToEdit -->|Vuelos| BackToFlights[Volver a búsqueda]
    WhatToEdit -->|Asientos| BackToSeats[Volver a asientos]
    WhatToEdit -->|Pasajeros| BackToPassengers[Volver a pasajeros]
    WhatToEdit -->|Pagador| InputPayerData
    
    BackToFlights --> End
    BackToSeats --> End
    BackToPassengers --> End
    
    SaveToSession --> End([Fin: Continuar a pago])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorRequired fill:#FF6B6B
    style ErrorPayerEmail fill:#FF6B6B
    style ErrorPayerPhone fill:#FF6B6B
    style ErrorPayerDocument fill:#FF6B6B
    style CannotContinue fill:#FFA500
    style ShowSummary fill:#87CEEB
```

---

## 8. Flujo de Simulación de Pago

Proceso de pago simulado con diferentes métodos y estados.

```mermaid
flowchart TD
    Start([Inicio: Pago]) --> ShowPaymentMethods[Mostrar métodos de pago:<br/>- Tarjeta crédito<br/>- Tarjeta débito<br/>- PSE]
    
    ShowPaymentMethods --> UserSelectsMethod{¿Método seleccionado?}
    
    UserSelectsMethod -->|Tarjeta crédito| ShowCreditForm[Formulario tarjeta crédito]
    UserSelectsMethod -->|Tarjeta débito| ShowDebitForm[Formulario tarjeta débito]
    UserSelectsMethod -->|PSE| ShowPSEForm[Formulario PSE]
    
    ShowCreditForm --> InputCardData[Ingresar:<br/>- Número tarjeta<br/>- Nombre titular<br/>- Fecha expiración<br/>- CVV]
    ShowDebitForm --> InputCardData
    ShowPSEForm --> InputPSEData[Seleccionar:<br/>- Banco<br/>- Tipo cuenta<br/>- Tipo persona]
    
    InputCardData --> ValidateCardData{¿Datos válidos?}
    InputPSEData --> ValidatePSEData{¿Datos válidos?}
    
    ValidateCardData -->|No| ErrorCardData[Error: Datos inválidos]
    ValidateCardData -->|Sí| CreateReservation
    ValidatePSEData -->|No| ErrorPSEData[Error: Datos inválidos]
    ValidatePSEData -->|Sí| CreateReservation
    
    ErrorCardData --> InputCardData
    ErrorPSEData --> InputPSEData
    
    CreateReservation[POST /api/bookings<br/>Crear reserva en BD] --> ReservationCreated{¿Reserva creada?}
    
    ReservationCreated -->|No| ErrorCreateReservation[Error: No se pudo crear]
    ReservationCreated -->|Sí| ShowProcessing[Mostrar pantalla<br/>'Procesando pago...']
    ErrorCreateReservation --> RetryCreate{¿Reintentar?}
    RetryCreate -->|Sí| CreateReservation
    RetryCreate -->|No| End
    
    ShowProcessing --> SimulatePayment[POST /api/payments/simulate<br/>Simular procesamiento]
    SimulatePayment --> RandomOutcome[Lógica de simulación:<br/>- 80% aprobado<br/>- 20% rechazado]
    
    RandomOutcome --> PaymentResult{¿Resultado?}
    
    PaymentResult -->|Aprobado| SaveApprovedPayment[INSERT pago estado='aprobado']
    PaymentResult -->|Rechazado| SaveRejectedPayment[INSERT pago estado='rechazado']
    
    SaveApprovedPayment --> UpdateReservationPaid[UPDATE reserva<br/>SET estado='pagada']
    SaveRejectedPayment --> UpdateReservationFailed[UPDATE reserva<br/>SET estado='pendiente']
    
    UpdateReservationPaid --> UpdateSeatsIssued[UPDATE asientos<br/>SET estado='emitido']
    UpdateReservationFailed --> ReleaseSeatsTimeout[Programar liberación<br/>de asientos]
    
    UpdateSeatsIssued --> ShowSuccessMessage[Mostrar mensaje:<br/>'¡Pago exitoso!']
    ReleaseSeatsTimeout --> ShowFailureMessage[Mostrar mensaje:<br/>'Pago rechazado']
    
    ShowSuccessMessage --> GenerateReference[Generar referencia pago]
    ShowFailureMessage --> OfferRetry{¿Reintentar pago?}
    
    GenerateReference --> End([Fin: Continuar a tiquetes])
    
    OfferRetry -->|Sí| ShowPaymentMethods
    OfferRetry -->|No| CancelReservation[Cancelar reserva]
    CancelReservation --> ReleaseSeats[Liberar asientos inmediatamente]
    ReleaseSeats --> End2([Fin: Reserva cancelada])
    
    style Start fill:#90EE90
    style End fill:#87CEEB
    style End2 fill:#FFB6C1
    style ErrorCardData fill:#FF6B6B
    style ErrorPSEData fill:#FF6B6B
    style ErrorCreateReservation fill:#FF6B6B
    style ShowSuccessMessage fill:#90EE90
    style ShowFailureMessage fill:#FF6B6B
    style ShowProcessing fill:#FFD700
```

---

## 9. Flujo de Generación de Tiquetes

Generación de tiquetes electrónicos en formato PDF o JSON.

```mermaid
flowchart TD
    Start([Inicio: Generar tiquetes]) --> GetReservationData[Obtener datos completos:<br/>- Reserva<br/>- Pasajeros<br/>- Vuelos<br/>- Asientos<br/>- Pago]
    
    GetReservationData --> ValidatePayment{¿Pago aprobado?}
    
    ValidatePayment -->|No| ErrorNoPayment[Error: Pago no aprobado]
    ValidatePayment -->|Sí| LoopPassengers[Iterar por cada pasajero]
    ErrorNoPayment --> End
    
    LoopPassengers --> CurrentPassenger{¿Pasajero actual?}
    CurrentPassenger --> GetPassengerData[Obtener datos pasajero]
    GetPassengerData --> GetFlightData[Obtener datos vuelo(s)]
    GetFlightData --> GetSeatData[Obtener asiento(s) asignado(s)]
    
    GetSeatData --> SelectFormat{¿Formato deseado?}
    
    SelectFormat -->|PDF| GeneratePDF[Generar PDF:<br/>- Logo aerolínea<br/>- Código QR<br/>- Datos vuelo<br/>- Datos pasajero<br/>- Asiento<br/>- Barcode]
    SelectFormat -->|JSON| GenerateJSON[Generar JSON estructurado:<br/>- Datos completos<br/>- Formato estándar]
    
    GeneratePDF --> SavePDFFile[Guardar archivo PDF<br/>en storage]
    GenerateJSON --> SaveJSONData[Guardar JSON en BD]
    
    SavePDFFile --> GetPDFURL[Obtener URL de archivo]
    SaveJSONData --> GetJSONContent[Obtener contenido JSON]
    
    GetPDFURL --> InsertTicketRecord1[INSERT INTO tiquetes<br/>formato='pdf']
    GetJSONContent --> InsertTicketRecord2[INSERT INTO tiquetes<br/>formato='json']
    
    InsertTicketRecord1 --> TicketInserted1{¿Insert exitoso?}
    InsertTicketRecord2 --> TicketInserted2{¿Insert exitoso?}
    
    TicketInserted1 -->|No| ErrorInsert1[Error: No se pudo crear]
    TicketInserted1 -->|Sí| GenerateTicketCode1[Generar código tiquete<br/>TKT-XXXXXXXX-001]
    
    TicketInserted2 -->|No| ErrorInsert2[Error: No se pudo crear]
    TicketInserted2 -->|Sí| GenerateTicketCode2[Generar código tiquete<br/>TKT-XXXXXXXX-001]
    
    ErrorInsert1 --> RetryInsert1{¿Reintentar?}
    ErrorInsert2 --> RetryInsert2{¿Reintentar?}
    RetryInsert1 -->|Sí| InsertTicketRecord1
    RetryInsert1 -->|No| End
    RetryInsert2 -->|Sí| InsertTicketRecord2
    RetryInsert2 -->|No| End
    
    GenerateTicketCode1 --> SaveTicketCode1[UPDATE tiquete<br/>SET codigo_tiquete]
    GenerateTicketCode2 --> SaveTicketCode2[UPDATE tiquete<br/>SET codigo_tiquete]
    
    SaveTicketCode1 --> CheckMorePassengers{¿Más pasajeros?}
    SaveTicketCode2 --> CheckMorePassengers
    
    CheckMorePassengers -->|Sí| CurrentPassenger
    CheckMorePassengers -->|No| AllTicketsGenerated[Todos los tiquetes generados]
    
    AllTicketsGenerated --> SendConfirmationEmail[Enviar email confirmación<br/>con enlaces descarga]
    SendConfirmationEmail --> EmailSent{¿Email enviado?}
    
    EmailSent -->|No| LogEmailError[Log: Error envío email]
    EmailSent -->|Sí| UpdateReservationConfirmed[UPDATE reserva<br/>SET estado='confirmada']
    LogEmailError --> UpdateReservationConfirmed
    
    UpdateReservationConfirmed --> End([Fin: Tiquetes generados])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorNoPayment fill:#FF6B6B
    style ErrorInsert1 fill:#FF6B6B
    style ErrorInsert2 fill:#FF6B6B
    style AllTicketsGenerated fill:#87CEEB
    style SendConfirmationEmail fill:#87CEEB
```

---

## 10. Flujo de Confirmación y Descarga de Tiquetes

Visualización de la confirmación y descarga de tiquetes electrónicos.

```mermaid
flowchart TD
    Start([Inicio: Confirmación]) --> ShowConfirmationPage[Mostrar página confirmación]
    
    ShowConfirmationPage --> DisplayReservationCode[Mostrar código reserva<br/>en grande y destacado]
    DisplayReservationCode --> DisplaySummary[Mostrar resumen:<br/>- Vuelos<br/>- Pasajeros<br/>- Asientos<br/>- Total pagado<br/>- Referencia pago]
    
    DisplaySummary --> DisplayTicketsList[Listar tiquetes generados:<br/>1 por pasajero]
    DisplayTicketsList --> OfferDownload[Ofrecer opciones descarga]
    
    OfferDownload --> UserAction{¿Acción del usuario?}
    
    UserAction -->|Ver tiquete| ViewTicket[Mostrar vista previa<br/>en navegador]
    UserAction -->|Descargar individual| DownloadSingle[Seleccionar tiquete]
    UserAction -->|Descargar todos| DownloadAll[Preparar descarga múltiple]
    UserAction -->|Enviar por email| SendByEmail[Solicitar email]
    UserAction -->|Imprimir| PrintTicket[Abrir diálogo impresión]
    
    ViewTicket --> ShowPreview[Mostrar PDF/JSON<br/>en ventana/modal]
    ShowPreview --> ClosePreview{¿Cerrar?}
    ClosePreview -->|Sí| UserAction
    ClosePreview -->|No| ShowPreview
    
    DownloadSingle --> SelectTicket{¿Cuál tiquete?}
    SelectTicket --> GetTicketURL1[GET /api/tickets/:id/download]
    GetTicketURL1 --> CheckFileExists1{¿Archivo existe?}
    
    CheckFileExists1 -->|No| ErrorFileNotFound1[Error: Archivo no encontrado]
    CheckFileExists1 -->|Sí| StartDownload1[Iniciar descarga]
    ErrorFileNotFound1 --> RetryDownload1{¿Reintentar?}
    RetryDownload1 -->|Sí| GetTicketURL1
    RetryDownload1 -->|No| UserAction
    
    StartDownload1 --> DownloadComplete1{¿Descarga completa?}
    DownloadComplete1 -->|No| ErrorDownload1[Error: Descarga fallida]
    DownloadComplete1 -->|Sí| ShowSuccessMessage1[Mensaje: Descarga exitosa]
    ErrorDownload1 --> RetryDownload1
    ShowSuccessMessage1 --> UserAction
    
    DownloadAll --> GetAllTicketsURLs[GET /api/tickets?reservation=XXX]
    GetAllTicketsURLs --> CreateZIP[Crear archivo ZIP<br/>con todos los tiquetes]
    CreateZIP --> ZIPCreated{¿ZIP creado?}
    
    ZIPCreated -->|No| ErrorZIP[Error: No se pudo crear ZIP]
    ZIPCreated -->|Sí| StartDownloadZIP[Iniciar descarga ZIP]
    ErrorZIP --> RetryZIP{¿Reintentar?}
    RetryZIP -->|Sí| CreateZIP
    RetryZIP -->|No| UserAction
    
    StartDownloadZIP --> DownloadCompleteZIP{¿Descarga completa?}
    DownloadCompleteZIP -->|No| ErrorDownloadZIP[Error: Descarga fallida]
    DownloadCompleteZIP -->|Sí| ShowSuccessMessageZIP[Mensaje: Todos descargados]
    ErrorDownloadZIP --> RetryZIP
    ShowSuccessMessageZIP --> UserAction
    
    SendByEmail --> InputEmailAddress[Solicitar dirección email]
    InputEmailAddress --> ValidateEmailInput{¿Email válido?}
    ValidateEmailInput -->|No| ErrorInvalidEmail[Error: Email inválido]
    ValidateEmailInput -->|Sí| SendEmailRequest[POST /api/tickets/send-email]
    ErrorInvalidEmail --> InputEmailAddress
    
    SendEmailRequest --> EmailSending[Procesando envío...]
    EmailSending --> EmailResult{¿Enviado?}
    EmailResult -->|No| ErrorEmailSend[Error: No se pudo enviar]
    EmailResult -->|Sí| ShowSuccessEmail[Mensaje: Email enviado]
    ErrorEmailSend --> RetryEmail{¿Reintentar?}
    RetryEmail -->|Sí| SendEmailRequest
    RetryEmail -->|No| UserAction
    ShowSuccessEmail --> UserAction
    
    PrintTicket --> OpenPrintDialog[Abrir diálogo impresión<br/>del navegador]
    OpenPrintDialog --> UserPrints{¿Usuario imprime?}
    UserPrints -->|Sí| Printing[Imprimiendo...]
    UserPrints -->|No| CancelPrint[Cancelar impresión]
    Printing --> UserAction
    CancelPrint --> UserAction
    
    UserAction -->|Salir| ShowFinalMessage[Mostrar mensaje despedida]
    ShowFinalMessage --> SaveToHistory[Guardar en historial usuario<br/>Opcional]
    SaveToHistory --> End([Fin: Proceso completo])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style ErrorFileNotFound1 fill:#FF6B6B
    style ErrorDownload1 fill:#FF6B6B
    style ErrorZIP fill:#FF6B6B
    style ErrorDownloadZIP fill:#FF6B6B
    style ErrorInvalidEmail fill:#FF6B6B
    style ErrorEmailSend fill:#FF6B6B
    style ShowSuccessMessage1 fill:#87CEEB
    style ShowSuccessMessageZIP fill:#87CEEB
    style ShowSuccessEmail fill:#87CEEB
```

---

## 11. Flujo de Liberación de Asientos por Timeout

Proceso automático para liberar asientos cuando expira el tiempo de reserva.

```mermaid
flowchart TD
    Start([Job ejecutado cada minuto]) --> QueryExpiredReservations[SELECT reservas<br/>WHERE estado='pendiente'<br/>AND fecha_expiracion < NOW]
    
    QueryExpiredReservations --> HasExpired{¿Hay reservas expiradas?}
    
    HasExpired -->|No| LogNoAction[Log: Sin reservas expiradas]
    HasExpired -->|Sí| LoopReservations[Iterar por cada reserva]
    LogNoAction --> End
    
    LoopReservations --> CurrentReservation{¿Reserva actual?}
    CurrentReservation --> GetReservationSeats[Obtener asientos<br/>de la reserva]
    
    GetReservationSeats --> BeginTransaction[BEGIN TRANSACTION]
    BeginTransaction --> UpdateSeatsAvailable[UPDATE asientos<br/>SET estado='disponible'<br/>SET reserva_id=NULL<br/>WHERE reserva_id=X]
    
    UpdateSeatsAvailable --> UpdateSuccess{¿Update exitoso?}
    UpdateSuccess -->|No| RollbackTx[ROLLBACK]
    UpdateSuccess -->|Sí| UpdateReservationExpired[UPDATE reserva<br/>SET estado='expirada']
    
    RollbackTx --> LogError[Log: Error liberando asientos]
    LogError --> CurrentReservation
    
    UpdateReservationExpired --> UpdateReservationSuccess{¿Update exitoso?}
    UpdateReservationSuccess -->|No| RollbackTx2[ROLLBACK]
    UpdateReservationSuccess -->|Sí| CommitTransaction[COMMIT]
    
    RollbackTx2 --> LogError2[Log: Error actualizando reserva]
    LogError2 --> CurrentReservation
    
    CommitTransaction --> UpdateFlightCapacity[UPDATE vuelo<br/>SET asientos_disponibles<br/>= asientos_disponibles + X]
    
    UpdateFlightCapacity --> NotifyUser{¿Notificar usuario?}
    NotifyUser -->|Sí| SendExpirationEmail[Enviar email:<br/>'Su reserva ha expirado']
    NotifyUser -->|No| LogSuccess
    
    SendExpirationEmail --> EmailSent{¿Email enviado?}
    EmailSent -->|No| LogEmailError[Log: Error envío email]
    EmailSent -->|Sí| LogSuccess[Log: Reserva expirada<br/>y asientos liberados]
    LogEmailError --> LogSuccess
    
    LogSuccess --> MoreReservations{¿Más reservas expiradas?}
    MoreReservations -->|Sí| CurrentReservation
    MoreReservations -->|No| FinalLog[Log: Proceso completado]
    
    FinalLog --> End([Fin: Esperar siguiente ejecución])
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style RollbackTx fill:#FF6B6B
    style RollbackTx2 fill:#FF6B6B
    style LogError fill:#FF6B6B
    style LogError2 fill:#FF6B6B
    style LogSuccess fill:#87CEEB
```

---

## 12. Flujo de Manejo de Errores Global

Estrategia general para manejo de errores en todo el sistema.

```mermaid
flowchart TD
    Start([Error ocurre en sistema]) --> CaptureError[Capturar error<br/>con try-catch o middleware]
    
    CaptureError --> IdentifyErrorType{¿Tipo de error?}
    
    IdentifyErrorType -->|Validación| ValidationError[Error de validación<br/>400 Bad Request]
    IdentifyErrorType -->|Autenticación| AuthError[Error autenticación<br/>401 Unauthorized]
    IdentifyErrorType -->|Autorización| ForbiddenError[Error autorización<br/>403 Forbidden]
    IdentifyErrorType -->|No encontrado| NotFoundError[Recurso no encontrado<br/>404 Not Found]
    IdentifyErrorType -->|Conflicto| ConflictError[Error conflicto<br/>409 Conflict]
    IdentifyErrorType -->|Servidor| ServerError[Error interno servidor<br/>500 Internal Server Error]
    IdentifyErrorType -->|Base datos| DBError[Error base datos<br/>500/503]
    IdentifyErrorType -->|Timeout| TimeoutError[Error timeout<br/>408/504]
    
    ValidationError --> LogError1[Log error con detalles]
    AuthError --> LogError2[Log intento acceso]
    ForbiddenError --> LogError3[Log intento no autorizado]
    NotFoundError --> LogError4[Log recurso no encontrado]
    ConflictError --> LogError5[Log conflicto de concurrencia]
    ServerError --> LogError6[Log error crítico + stack]
    DBError --> LogError7[Log error BD + query]
    TimeoutError --> LogError8[Log timeout + operación]
    
    LogError1 --> PrepareUserMessage1[Mensaje usuario:<br/>'Datos inválidos: X']
    LogError2 --> PrepareUserMessage2[Mensaje usuario:<br/>'Sesión expirada']
    LogError3 --> PrepareUserMessage3[Mensaje usuario:<br/>'Sin permisos']
    LogError4 --> PrepareUserMessage4[Mensaje usuario:<br/>'No encontrado']
    LogError5 --> PrepareUserMessage5[Mensaje usuario:<br/>'Recurso no disponible']
    LogError6 --> PrepareUserMessage6[Mensaje usuario:<br/>'Error del sistema']
    LogError7 --> PrepareUserMessage7[Mensaje usuario:<br/>'Error de conexión']
    LogError8 --> PrepareUserMessage8[Mensaje usuario:<br/>'Tiempo agotado']
    
    PrepareUserMessage1 --> ReturnErrorResponse1[return {<br/>status: 400,<br/>message: X,<br/>code: 'VALIDATION_ERROR'<br/>}]
    PrepareUserMessage2 --> ReturnErrorResponse2[return {<br/>status: 401,<br/>message: X,<br/>code: 'AUTH_ERROR'<br/>}]
    PrepareUserMessage3 --> ReturnErrorResponse3[return {<br/>status: 403,<br/>message: X,<br/>code: 'FORBIDDEN'<br/>}]
    PrepareUserMessage4 --> ReturnErrorResponse4[return {<br/>status: 404,<br/>message: X,<br/>code: 'NOT_FOUND'<br/>}]
    PrepareUserMessage5 --> ReturnErrorResponse5[return {<br/>status: 409,<br/>message: X,<br/>code: 'CONFLICT'<br/>}]
    PrepareUserMessage6 --> ReturnErrorResponse6[return {<br/>status: 500,<br/>message: X,<br/>code: 'SERVER_ERROR'<br/>}]
    PrepareUserMessage7 --> ReturnErrorResponse7[return {<br/>status: 500,<br/>message: X,<br/>code: 'DB_ERROR'<br/>}]
    PrepareUserMessage8 --> ReturnErrorResponse8[return {<br/>status: 408,<br/>message: X,<br/>code: 'TIMEOUT'<br/>}]
    
    ReturnErrorResponse1 --> FrontendReceives[Frontend recibe respuesta]
    ReturnErrorResponse2 --> FrontendReceives
    ReturnErrorResponse3 --> FrontendReceives
    ReturnErrorResponse4 --> FrontendReceives
    ReturnErrorResponse5 --> FrontendReceives
    ReturnErrorResponse6 --> FrontendReceives
    ReturnErrorResponse7 --> FrontendReceives
    ReturnErrorResponse8 --> FrontendReceives
    
    FrontendReceives --> DisplayError[Mostrar error en UI:<br/>- Toast notification<br/>- Modal<br/>- Mensaje inline]
    
    DisplayError --> OfferAction{¿Ofrecer acción?}
    OfferAction -->|Reintentar| ShowRetryButton[Mostrar botón 'Reintentar']
    OfferAction -->|Navegar| ShowNavigationButton[Mostrar 'Volver a...']
    OfferAction -->|Contactar| ShowContactInfo[Mostrar 'Contactar soporte']
    OfferAction -->|Solo informar| NoActionNeeded[Solo mensaje informativo]
    
    ShowRetryButton --> UserRetries{¿Usuario reintenta?}
    ShowNavigationButton --> UserNavigates[Usuario navega a otra sección]
    ShowContactInfo --> UserContacts[Usuario puede contactar soporte]
    NoActionNeeded --> End
    
    UserRetries -->|Sí| RetryOperation[Ejecutar operación nuevamente]
    UserRetries -->|No| End
    RetryOperation --> End
    UserNavigates --> End
    UserContacts --> End
    
    End([Fin: Error manejado])
    
    style Start fill:#FF6B6B
    style End fill:#FFB6C1
    style ConflictError fill:#FFA500
    style ServerError fill:#FF0000
    style DBError fill:#FF0000
    style DisplayError fill:#FFD700
```

---

## 13. Resumen de operaciones cubiertas

Este documento incluye diagramas de flujo detallados para:

1. ✅ **Flujo general del sistema** - Visión completa del proceso
2. ✅ **Búsqueda de vuelos** - Con autocompletado y validaciones
3. ✅ **Selección de vuelo** - Verificación de capacidad
4. ✅ **Selección de asientos** - Con control de concurrencia crítico
5. ✅ **Registro de pasajeros** - Hasta 5 pasajeros con validaciones
6. ✅ **Datos del pagador** - Con términos y condiciones
7. ✅ **Simulación de pago** - Múltiples métodos (crédito, débito, PSE)
8. ✅ **Generación de tiquetes** - Formato PDF y JSON
9. ✅ **Confirmación y descarga** - Múltiples opciones de descarga
10. ✅ **Liberación de asientos** - Proceso automático por timeout
11. ✅ **Manejo de errores** - Estrategia global

Cada diagrama puede ser visualizado en herramientas compatibles con Mermaid como:
- GitHub/GitLab (renderizado automático)
- VS Code (con extensión Mermaid)
- Mermaid Live Editor (https://mermaid.live)
- Notion, Obsidian, etc.

---

**Notas importantes:**
- Los diagramas incluyen flujos felices y alternativos (errores)
- Se destacan puntos críticos de concurrencia y validación
- Los colores ayudan a identificar estados: verde (inicio), azul (éxito), rojo (error), naranja (advertencia)
- Cada operación considera reintentos y manejo de errores apropiado

**Próximos pasos:**
1. Revisar y validar flujos con el equipo
2. Implementar cada flujo según los diagramas
3. Crear tests que verifiquen cada camino del diagrama
4. Documentar cambios si los flujos se modifican durante desarrollo
