# Backend de inscripciones

Archivo: [`Code.gs`](Code.gs). Guía de despliegue: [`docs/apps-script-setup.md`](../docs/apps-script-setup.md).

La hoja oficial es [Innovathon Mollendo 2026 - Inscripciones](https://docs.google.com/spreadsheets/d/1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8/edit).

El backend recibe el celular obligatorio, evita duplicados por DNI y correo bajo un único bloqueo, y adapta la escritura a los encabezados existentes. El correo se envía después de liberar el bloqueo.

Actualiza la implementación existente para conservar su URL. El código también puede funcionar como proyecto de QA independiente, con una hoja vacía distinta, `REGISTRATION_TEST_MODE=true` y `QA_SPREADSHEET_ID` configurados solo en ese proyecto. El manifiesto de QA es `appsscript.qa.json`; no lo uses para ampliar los permisos del proyecto de producción.

Resultados y limitaciones de las pruebas: [`pruebas-finales.md`](../docs/pruebas-finales.md).
