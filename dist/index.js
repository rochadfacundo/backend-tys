"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Para procesar JSON en requests
app.post("/atmCotizar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post("http://wsatm-dev.atmseguros.com.ar/index.php/soap", soapRequest, {
            headers: { "Content-Type": "text/xml" },
            timeout: 60000, // 60s timeout
        });
        const endTime = Date.now();
        console.log(`✅ Respuesta recibida en ${(endTime - startTime) / 1000} segundos`);
        res.status(200).send(response.data);
    }
    catch (error) {
        console.error("❌ Error en la petición:", error.message);
        res.status(500).json({ error: "Error en la comunicación con ATM", details: error.message });
    }
}));
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
