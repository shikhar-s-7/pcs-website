# Capabilities

Source: `reference/capabilities.html`

## Document head

Title: Capabilities | Dhruvir

Description: Grid-forming PCS hardware, compliance validation, and dispatch software for battery energy storage. Modular 100 kW blocks, VSG control, HIL-validated, engineered for weak grids and 50C ambients.

## Header

DHRUVIR
POWER CONVERSION

- Overview
- Capabilities
- Enquiries
- Start a project

## Page hero

Dhruvir / Capabilities

CAP Engineering capability

# Hardware, controls, and evidence. Built as one system.

Grid-forming conversion hardware, the firmware that makes it behave like a machine, and the validation trail that proves it to a regulator. Each is engineered against the others.

## CAP / 01 Grid-forming power conversion

The Dhruvir PCS line is a modular 100 kW building block that parallels into systems from 100 kW to 5 MW, sized for the C&I and small-utility segment that imported OEMs do not engineer for. At its core is a virtual synchronous generator (VSG) control stack: the converter emulates the swing equation of a synchronous machine, delivering synthetic inertia and damping instead of merely following the grid's phase.

The result is a converter that forms the grid where there is none, stabilizes it where it is weak, and transitions between grid-forming and grid-following operation without a bump in output.

- Synthetic inertia & damping
  Adjustable inertia constant and power oscillation damping, tuned per site.
- Black start
  Energizes a dead bus, including transformer inrush, without external supply.
- GFM / GFL transition
  Seamless mode transition on grid events, with islanded voltage-source operation.
- Weak-grid stability
  Control stability designed and tested down to SCR 1.0, where most GFM claims assume SCR 3+.
- Fault ride-through
  Voltage and frequency ride-through windows matched to the Indian Grid Code.
- Phase-jump immunity
  Rides through the phase jumps that trip grid-following fleets in weak pockets.

### PCS platform / preliminary design targets

| | |
| --- | --- |
| Building block | 100 kW, paralleled to 5 MW |
| DC voltage | Up to 1500 V |
| Control core | VSG (virtual synchronous generator) |
| Grid modes | GFM, GFL, islanded, black start |
| Weak-grid stability | SCR 1.0 - 1.5 |
| Max efficiency | ≥ 98.5% |
| Current THD | < 3% at rated power |
| Overload | 1.2× / 10 s transient |
| Ambient | -10 to 50°C, full power at 50 |
| Enclosure | IP54, conformal-coated boards |
| Comms | Modbus TCP, IEC 61850, IEC 60870-5-104 |
| Grid codes | IEGC, IEEE 1547, UL 1741 SB |

\* Preliminary engineering targets, subject to type-test validation. Final values published with test reports.

## CAP / 02 Compliance & validation lab

Image: `assets/lab.jpg`
Alt: Hardware-in-the-loop validation bench
Caption: Real-time HIL bench
  Control strategies proven on iron before they touch a battery

The 2026 draft regulations make evidence the customer's actual problem: EMT studies at design stage, demonstrated GFM and black start at commissioning, periodic re-verification by load despatch centres. Dhruvir's lab exists to produce that evidence, for our hardware and for anyone else's.

Controls are validated on a hardware-in-the-loop bench against a real-time grid model before any site visit. When the dispatch layer or a PCS unit ships, its behavior under faults, weak grids, and islanding has already been measured, not simulated in the marketing sense.

- EMT models
  PSCAD / EMT-type and PSSE models delivered with every project, ready for utility study submission.
- HIL validation
  Real-time simulator testing of control firmware against fault, weak-grid, and islanding scenarios.
- Witnessed commissioning tests
  GFM, black start, and ride-through demonstrated at site, documented for the load despatch centre.
- Periodic re-verification
  Retainer-based re-testing and reporting as regulations finalize and audits begin.

## CAP / 03 Dispatch & asset management

India has built the price signal for storage and almost none of the software to capture it. Dhruvir's dispatch layer re-solves charge and discharge per site, daily, against time-of-day tariffs, exchange prices, demand charges, and degradation cost. The asset-management layer underneath it tracks state of health, warranty compliance, and availability, the monthly discipline asset owners actually pay for.

The differentiator is the lab: dispatch and GFM-compliant control strategies are validated on real power hardware before deployment, so the control warranty we sign is backed by measurement.

- Dispatch optimization
  TOD tariffs, day-ahead and real-time prices, DSM penalty avoidance, demand-charge shaving.
- Asset management
  SOH and degradation analytics, warranty-compliance telemetry, alarm triage, availability reporting.
- Vendor-neutral
  Multi-OEM monitoring and control over Modbus TCP and IEC 60870-5-104. No hardware lock-in.
- Aggregation-ready
  Fleet pooling for ancillary and discom flexibility products as those markets open.

Image: `assets/dash.jpg`
Alt: Dhruvir dispatch and asset management dashboard
Caption: Fleet dispatch console
  Price-aware scheduling across distributed sites

## APP Where it deploys

## Built for the segments imports ignore.

- C&I battery storage
  100 kW to 5 MW behind-the-meter systems needing tariff optimization, backup, and GFM compliance without utility-scale budgets.
- EV charging hubs
  Storage-buffered fast charging where grid connections are weak and demand charges are punishing.
- Solar-plus-storage
  Co-located storage meeting the mandatory-storage and GFM clauses of the 2026 connectivity framework.
- Weak-grid RE plants
  Renewable sites in low-SCR pockets facing the 15% grid-forming quota from July 2027.
- Microgrids & islands
  Voltage-source operation, black start, and seamless transition for industrial microgrids and islanded systems.
- BESS integrators
  Certified GFM control firmware and compliance evidence for integrators assembling containers from imported cells.

## NEXT Start a project

## Bring us the grid problem your current vendor can't solve.

PCS supply, compliance evidence, or dispatch software. One engineering team, one business-day response.

Send an enquiry ->
Link: `contact.html`

## Footer

DHRUVIR
POWER CONVERSION

Grid-forming power conversion, compliance validation, and dispatch software for battery energy storage.

### Site

- Overview
- Capabilities
- Enquiries

### Capabilities

- Grid-forming PCS
- Compliance & validation
- Dispatch software

### Contact

- Enquiry form

© 2026 DHRUVIR. ALL RIGHTS RESERVED.

BENGALURU / INDIA

## Links

- `favicon.svg`
- `https://fonts.googleapis.com`
- `https://fonts.gstatic.com`
- `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650&family=JetBrains+Mono:wght@400;500&display=swap`
- `assets/style.css`
- `assets/main.js`
- `assets/lab.jpg`
- `assets/dash.jpg`
- `index.html`
- `capabilities.html`
- `capabilities.html#pcs`
- `capabilities.html#compliance`
- `capabilities.html#dispatch`
- `contact.html`
