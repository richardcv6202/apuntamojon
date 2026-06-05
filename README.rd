# ?? ApuntaMOJÓN

**Versión 1.0.0 FINAL** — Aplicación para control de partidas de dominó (2-4 jugadores)

> Creada por **Ricardo Castillo (Richard)** — La Demajagua, Isla de la Juventud, Cuba

[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Stable](https://img.shields.io/badge/status-stable-brightgreen)

---

## ?? Tabla de contenidos

- [Descripción general](#-descripción-general)
- [Novedades de la versión 1.0.0 FINAL](#-novedades-de-la-versión-100-final)
- [Características principales](#-características-principales)
- [Instalación (PWA)](#-instalación-pwa)
- [Guía de uso rápido](#-guía-de-uso-rápido)
- [Reglas del juego](#-reglas-del-juego-modalidad-mojón)
- [Formación de la palabra MOJÓN](#-formación-de-la-palabra-mojón)
- [Escala de tantos a letras](#-escala-de-tantos-a-letras)
- [Módulo de estadísticas](#-módulo-de-estadísticas)
- [Estadísticas diarias](#-estadísticas-diarias)
- [Ranking global](#-ranking-global)
- [Detalle por jugador](#-detalle-por-jugador)
- [Gestión de datos](#-gestión-de-datos)
- [Manual de usuario](#-manual-de-usuario)
- [Acceso a funciones](#-acceso-a-funciones)
- [Borrar todos los datos](#-borrar-todos-los-datos)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Créditos y agradecimientos](#-créditos-y-agradecimientos)
- [Licencia](#-licencia)

---

## ?? Descripción general

**ApuntaMOJÓN** es una aplicación web progresiva (PWA) diseñada para el control de partidas de dominó en la variante donde el perdedor es quien completa la palabra **MOJÓN**. Nace en la peña de dominó de La Demajagua, donde los jugadores buscaban una forma divertida y diferente de jugar, con un sistema de penalización por acumulación de letras.

La app automatiza el registro de manos, el cálculo de letras según los tantos acumulados, y mantiene estadísticas detalladas de todos los jugadores. Es una **PWA** (Progressive Web App), por lo que puede instalarse en el móvil y funciona **sin conexión a internet** después de la primera carga.

---

## ?? Novedades de la versión 1.0.0 FINAL

| Característica | Descripción |
|----------------|-------------|
| **?? Formación progresiva de MOJÓN** | M ? MO ? MOJ ? MOJO ? MOJÓ ? MOJÓN con regla especial para la Ó |
| **?? Estadísticas completas** | Diarias, globales y por jugador con múltiples indicadores |
| **?? Ranking global** | Ordenado por cantidad de MOJONES (los más "malos" arriba) |
| **?? +Gorda** | Máximo de tantos con que un jugador ha perdido |
| **?? Exportar/Importar JSON** | Copias de seguridad completas de los datos |
| **??? Limpiar BD con contraseña** | Contraseña `mojon` para evitar borrados accidentales |
| **?? Manual de usuario integrado** | Botón ? con manual completo y FAQ |
| **?? Modales personalizados** | Sin alerts del sistema, todo con modales temáticos |
| **?? Instalable como app** | Funciona offline después de la primera carga |
| **?? Persistencia automática** | Las partidas se guardan automáticamente |

---

## ? Características principales

- ? **Soporte para 2, 3 o 4 jugadores** por partida
- ? **Registro de manos** con cálculo automático de letras
- ? **Formación progresiva** de la palabra MOJÓN
- ? **Estadísticas diarias** (partidas, mojones, +Gorda)
- ? **Estadísticas globales** (ranking con % de mojones, cierres, pegues)
- ? **Detalle por jugador** (partidas, manos, mojones, +Gorda, mínimos, letras acumuladas, cierres, pegues)
- ? **Exportación/Importación** de datos a JSON
- ? **Funcionamiento offline** (PWA)
- ? **Instalable como app** en el móvil
- ? **Modales personalizados** (sin alerts del sistema)
- ? **Manual de usuario integrado**
- ? **Persistencia de datos** en `localStorage`

---

## ?? Instalación (PWA)

### En tu móvil Android (recomendado)

1. Abre la aplicación en **Chrome** (desde la URL de GitHub Pages o local)
2. Toca los tres puntos ? en la esquina superior derecha
3. Selecciona **"Instalar aplicación"** o **"Agregar a pantalla de inicio"**
4. Confirma el nombre "ApuntaMOJÓN"
5. La app quedará instalada como una nativa y funcionará **sin internet**

### En tu iPhone/iPad (iOS)

1. Abre la aplicación en **Safari**
2. Toca el botón **"Compartir"** (cuadrado con flecha hacia arriba)
3. Desplázate hacia abajo y selecciona **"Añadir a pantalla de inicio"**
4. Confirma el nombre "ApuntaMOJÓN"
5. La app se instalará en tu pantalla de inicio

### Verificar instalación correcta

- ? El icono debe aparecer en tu pantalla de inicio
- ? Al abrir la app, no debe mostrar la barra de direcciones del navegador
- ? Debe funcionar incluso en modo avión (sin internet)

---

## ?? Guía de uso rápido

### 1. Pantalla de inicio (Mesa de juego)

- **?? Jugadores:** Selecciona 2, 3 o 4 jugadores
- **?? Nombres (obligatorios):** Todos los jugadores deben tener nombre
- **Botón principal:** "?? Iniciar partida"

### 2. Pantalla de juego

Cada jugador tiene una **tarjeta** con:
- Nombre del jugador
- Campo para editar nombre
- ?? Progreso: palabra actual formada
- ?? Letras acumuladas / 6 (total necesario para perder)

### 3. Botones globales

| Botón | Función |
|-------|---------|
| ?? Iniciar partida | Comienza una nueva partida con los nombres ingresados |
| ? Cancelar partida | Cancela la partida actual (pierde progreso) |
| ?? Anotación | Registra una mano (solo disponible durante la partida) |
| ?? Estadísticas | Muestra estadísticas diarias, globales y por jugador |
| ?? Import/Export | Gestiona copias de seguridad de datos |
| ? Ayuda | Abre el manual de usuario |

### 4. Cómo anotar una mano

1. Presiona **"Anotación"**
2. Marca **"?? Un jugador se pegó"** si aplica (el que se pegó no puede ser perdedor)
3. Selecciona quién cerró o pegó (usando los botones de radio)
4. Selecciona el/los perdedores (usando checkboxes)
5. Ingresa los tantos acumulados
6. Presiona **"Aceptar"**

---

## ?? Reglas del juego (modalidad MOJÓN)

### Conceptos clave

- **?? MOJÓN:** Palabra que forma el perdedor (M ? MO ? MOJ ? MOJO ? MOJÓ ? MOJÓN)
- **?? Tantos:** Puntos acumulados por el perdedor en cada mano
- **?? Pegue:** Jugador se queda sin fichas ? no puede ser perdedor
- **?? Cierre:** Jugador coloca última ficha ? puede ser perdedor
- **?? Perdedor:** Recibe letras según los tantos acumulados

---

## ?? Formación de la palabra MOJÓN

| Pérdidas acumuladas | Palabra formada | Acción |
|---------------------|-----------------|--------|
| 0 | (vacío) | Sin letras |
| 1 | **M** | Se añade la M |
| 2 | **MO** | Se añade la O |
| 3 | **MOJ** | Se añade la J |
| 4 | **MOJO** | Se añade otra O |
| 5 | **MOJÓ** | La O se convierte en Ó (acentuada) |
| 6 | **MOJÓN** | Se añade la N ? **EL JUGADOR PIERDE** |

### Ejemplo práctico
