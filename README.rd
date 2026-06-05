# 💩 ApuntaMOJÓN

**ApuntaMOJÓN** es una aplicación web progresiva (PWA) para el control de partidas de dominó en la variante donde el perdedor es quien completa la palabra **MOJÓN**.

## 🎯 Características

- ✅ Soporte para 2, 3 o 4 jugadores
- ✅ Registro de manos con cálculo automático de letras
- ✅ Formación progresiva de la palabra MOJÓN (M → MO → MOJ → MOJO → MOJÓ → MOJÓN)
- ✅ Estadísticas diarias y globales
- ✅ Exportación/Importación de datos
- ✅ Funciona sin conexión (offline first)
- ✅ Instalable como app en el móvil
- ✅ Modales personalizados (sin alerts del sistema)
- ✅ Botón de ayuda con manual integrado

## 📱 Instalación como PWA

1. Abre la URL en Chrome/Safari
2. Toca el botón "Compartir"
3. Selecciona "Añadir a pantalla de inicio"
4. Abre la app desde el icono

## 🎮 Cómo jugar

### Escala de tantos a letras

| Tantos | Letras |
|--------|--------|
| < 26 | 1 letra |
| 26-50 | 2 letras |
| 51-75 | 3 letras |
| 76-100 | 4 letras |
| 101-125 | 5 letras |
| ≥ 126 | 6 letras (MOJÓN) |

### Formación de MOJÓN

| Pérdidas | Palabra |
|----------|---------|
| 1 | M |
| 2 | MO |
| 3 | MOJ |
| 4 | MOJO |
| 5 | MOJÓ |
| 6 | MOJÓN (PIERDE) |

## 📊 Estadísticas

- **Diario:** Resumen del día actual y días anteriores
- **Global:** Ranking con % de mojones, cierres y pegues
- **Detalle:** Estadísticas individuales por jugador

## 🛠️ Tecnologías utilizadas

- HTML5 / CSS3
- JavaScript (Vanilla)
- LocalStorage para persistencia
- Service Worker para PWA
- Manifest para instalación

## 📂 Estructura del proyecto
