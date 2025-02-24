import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Para procesar JSON en requests

app.post("/atmCotizar", async (req: Request, res: Response) => {
  console.log("🔹 Nueva solicitud recibida");

  try {
    console.log("⏳ Enviando petición a ATM...");

    const soapRequest = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:tem="http://tempuri.org/" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
      <soapenv:Body>
        <tem:AUTOS_Cotizar>
          <tem:doc_in>
            <auto>
              <usuario>
                <usa>TECYSEG</usa>
                <pass>TECYSEG%24</pass>
                <fecha>10032025</fecha>
                <vendedor>0956109561</vendedor>
                <origen>WS</origen>
                <plan>02</plan>
              </usuario>
              <asegurado>
                <persona>F</persona>
                <iva>CF</iva>
              </asegurado>
              <bien>
                <cerokm>N</cerokm>
                <marca>18</marca>
                <modelo>505</modelo>
                <anofab>2010</anofab>
                <seccion>3</seccion>
                <uso>0101</uso>
                <codpostal>1005</codpostal>
              </bien>
            </auto>
          </tem:doc_in>
        </tem:AUTOS_Cotizar>
      </soapenv:Body>
    </soapenv:Envelope>`;

    const startTime = Date.now();

    const response = await axios.post(
        "http://wsatm-dev.atmseguros.com.ar/index.php/soap",
        soapRequest,
        {
          headers: { "Content-Type": "text/xml" },
          timeout: 30000, // Reducimos timeout a 30s
        }
      );

    const endTime = Date.now();
    console.log(`✅ Respuesta recibida en ${(endTime - startTime) / 1000} segundos`);

    res.status(200).send(response.data);
  } catch (error: any) {
    console.error("❌ Error en la petición:", error.message);
    res.status(500).json({ error: "Error en la comunicación con ATM", details: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
