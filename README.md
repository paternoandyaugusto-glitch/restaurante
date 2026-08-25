# Kansas Operations

Prototipo funcional y responsive de una plataforma SaaS de gestión gastronómica diseñada para Kansas Grill & Bar.

## Ejecutar

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. La landing conduce a una demo con datos simulados; no requiere credenciales reales.

## Alcance implementado

- Landing comercial de marca.
- Login de demo con perfiles.
- Dashboard operativo en tiempo real.
- Mapa visual de mesas y cambios de estado.
- Toma de pedidos y envío a cocina.
- Kitchen Display System con alertas y notificación al mozo.
- Reservas y lista de espera con recomendación de mesa.
- Cuentas, división y pagos básicos.
- Menú y disponibilidad.
- Carga del personal y recomendación de asignación.
- Esquema PostgreSQL/Prisma preparado para multi-tenancy.

La demo usa un store local para que todos los flujos puedan probarse sin infraestructura. La arquitectura de producción, los contratos de tiempo real, permisos, modelo de datos y roadmap están detallados en [docs/PRODUCT_BLUEPRINT.md](docs/PRODUCT_BLUEPRINT.md).

## Asset visual

La fotografía principal fue generada para este proyecto con el modo integrado de ImageGen. Prompt final: restaurante americano contemporáneo premium al anochecer, madera oscura, piedra, cuero coñac, luz ámbar y plato de steak en primer plano; composición 16:9 con espacio negativo a la izquierda, sin logos ni texto.
