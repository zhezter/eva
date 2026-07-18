# EVA - Estudio Virtual Asistido

App de escritorio (Windows/Mac/Linux) construida con **Tauri + React + TypeScript**
para llevar registro de sesiones de estudio con un flujo simple pero estadísticas claras.

## Qué es EVA

EVA está diseñada para personas a las que el Pomodoro no les funciona. En lugar de
imponer bloques de tiempo rígidos, EVA te permite tomar el registro de tus tiempos
de estudio con un toggle simple: un click para iniciar, otro para pausar, otro para
detener.

### Características principales

- **Toggle estudio/ocio**: Un botón que alterna entre estado de estudio y descanso.
- **Pausa de sesión**: Detiene la sesión sin cerrarla (para cambios de actividad).
- **Ventana flotante**: Widget siempre visible con los controles principales.
- **Estadísticas**: Récord de tiempo continuo, máximo descanso, stats por rango (hoy, 3, 7, 15, 30 días).
- **Check-in de energía**: Cada 45 minutos pregunta cómo te sientes (1-5).
- **Sistema de metas**: Crea objetivos con pre/post cuestionario de dificultad.
- **4 temas**: Sakura (girly), Midnight Focus (oscuro), Sage (verde), Ink & Paper (neutro).

Los datos se guardan localmente (localStorage) — nada sale del equipo.

## Requisitos

- [Node.js](https://nodejs.org) 18+
- [Rust](https://www.rust-lang.org/tools/install)
- Dependencias del sistema de Tauri según tu SO

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run tauri dev
```

## Solo navegador

```bash
npm run dev
```

Abre `http://localhost:1420`.

## Build

```bash
npm run tauri build
```

El instalador queda en `src-tauri/target/release/bundle/`.

## Estructura

```
src/
  components/       -> Dashboard, FloatingWidget, SessionPanel, StatisticsPanel, GoalsPanel, etc.
  hooks/            -> useSession, useGoals, useStatistics
  lib/              -> storage.ts (persistencia), types.ts
  themes/           -> definición de temas y ThemeContext
  styles/           -> global.css
src-tauri/          -> shell nativo (Rust) para app de escritorio
```
