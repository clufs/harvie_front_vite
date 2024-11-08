import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import {
  Document,
  Page,
  Text,
  View,
  PDFDownloadLink,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Product, getBarCodes } from "./provider/slices/product";

import { useAppSelector, useAppDispatch } from "./provider/hooks";
import { startGetAllProducts } from "./provider/slices/product";
import {
  MonthlySummary,
  startGetMonthlySummary,
} from "./provider/slices/summary";
// import {  Pie } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
// import { PDFSummary } from "./components/SummaryPdf";

interface LogginResp {
  user: string;
  company: string;
  token: string;
}

export const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [userData, setUserData] = useState<any>({});

  const dispatch = useAppDispatch();

  const getAllsProducts = () => {
    dispatch(startGetAllProducts());
  };

  const getBarCodesPdf = () => {
    dispatch(getBarCodes());
  };

  const getMonthlySummary = () => {
    dispatch(startGetMonthlySummary());
  };

  const { ok, products } = useAppSelector((state) => state.product);
  const { ok: todoPiolon, summary } = useAppSelector((state) => state.summary);

  const [isPdfCreated, setIsPdfCreated] = useState(false);
  const [isPDFSummaryCreated, setIsPDFSummaryCreated] = useState(false);

  useEffect(() => {
    if (ok) setIsPdfCreated(true);
    if (todoPiolon) setIsPDFSummaryCreated(true);
  }, [ok, todoPiolon]);

  const loggin = async () => {
    const response = await axios.post<LogginResp>(
      "https://backend-harvey-production.up.railway.app/api/auth/login",
      {
        phone: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setToken(response.data.token);

    console.log(response.data);
    setUserData(response.data);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("token-init-date", new Date().getTime().toString());
  };

  const myToken = localStorage.getItem("token");
  const myUrl =
    "https://backend-harvey-production.up.railway.app/api/products/pdf";

  const obtenerPDF = async () => {
    // const myUrl = "http://localhost:3000/api/products/pdf";
    try {
      const response = await axios.get(myUrl, {
        headers: {
          Authorization: `Bearer ${myToken}`,
        },
        responseType: "blob", // Indica que la respuesta es un archivo blob
      });

      console.log(response.data);

      // Crea una URL temporal para descargar el archivo PDF
      const urlArchivo = URL.createObjectURL(new Blob([response.data]));

      // Crea un enlace temporal y haz clic en él para descargar el archivo
      const link = document.createElement("a");
      link.href = urlArchivo;
      link.setAttribute("download", "archivo.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Maneja los errores de solicitud aquí
      console.error("Error al obtener el PDF:", error);
    }
  };

  return (
    // <Container>
    //   <Box
    //     sx={{ height: "90vh" }}
    //     display={"flex"}
    //     flexDirection="column"
    //     alignItems={"center"}
    //     justifyContent={"center"}
    //   >
    //     {!token && (
    //       <>
    //         <TextField
    //           variant="outlined"
    //           label="Usuario"
    //           sx={{ paddingBottom: 2 }}
    //           value={username}
    //           onChange={(event) => setUsername(event.target.value)}
    //         />
    //         <TextField
    //           variant="outlined"
    //           label="Contrasena"
    //           sx={{ paddingBottom: 2 }}
    //           value={password}
    //           onChange={(event) => setPassword(event.target.value)}
    //         />

    //         <Button variant="contained" onClick={() => loggin()}>
    //           Ingresar
    //         </Button>
    //       </>
    //     )}
    //     {token && (
    //       <>
    //         <div>
    //           <p>{userData.fullName}</p>
    //           <p>{userData.company}</p>
    //         </div>
    //         <button onClick={obtenerPDF}>Obtener Codigos</button>
    //         <Button
    //           disabled={isPDFSummaryCreated}
    //           variant="contained"
    //           onClick={() => getMonthlySummary()}
    //         >
    //           Generar Reporte mensual
    //         </Button>
    //         {todoPiolon && (
    //           <PDFDownloadLink
    //             document={<PDFSummary summary={summary} />}
    //             fileName="resumen-mensual.pdf"
    //           >
    //             {({ blob, url, loading, error }) =>
    //               loading ? (
    //                 <>
    //                   <CircularProgress />
    //                 </>
    //               ) : (
    //                 <Button variant="contained" color="success" sx={{ mt: 4 }}>
    //                   Descargar Resumen
    //                 </Button>
    //               )
    //             }
    //           </PDFDownloadLink>
    //         )}
    //       </>
    //     )}
    //     {token && (
    //       <Box
    //         sx={{
    //           padding: 5,
    //           height: 150,
    //           borderColor: "black",
    //           border: 1,
    //           borderRadius: 5,
    //         }}
    //       >
    //         <Button>
    //           <a href="/sales-of-month">Ir Al Resumen Mensual</a>
    //         </Button>
    //         <Button
    //           disabled={isPdfCreated}
    //           variant="contained"
    //           onClick={() => getAllsProducts()}
    //         >
    //           Generar Codigos
    //         </Button>

    //         <Box sx={{ marginTop: 5 }} />

    //         {ok && (
    //           <PDFDownloadLink
    //             document={<PDFDocument products={products} />}
    //             fileName="documento.pdf"
    //           >
    //             {({ blob, url, loading, error }) =>
    //               loading ? (
    //                 <>
    //                   <CircularProgress />
    //                 </>
    //               ) : (
    //                 <Button variant="contained" color="success" sx={{ mt: 4 }}>
    //                   Descargar PDF
    //                 </Button>
    //               )
    //             }
    //           </PDFDownloadLink>
    //         )}
    //       </Box>
    //     )}
    //   </Box>
    // </Container>
    <Container>
      <Box
        sx={{
          margin: 0,

          height: "100vh",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#1c1c1c",
          color: "#e0e0e0",
          borderRadius: 2,
          boxShadow: 3,
          padding: 0,
          width: "100%",
        }}
      >
        {!token ? (
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Iniciar Sesión
            </Typography>
            <TextField
              variant="filled"
              label="Usuario"
              fullWidth
              InputLabelProps={{ style: { color: "#bdbdbd" } }}
              InputProps={{
                style: { color: "#f1f1f1", backgroundColor: "#333" },
              }}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
              variant="filled"
              label="Contraseña"
              type="password"
              fullWidth
              InputLabelProps={{ style: { color: "#bdbdbd" } }}
              InputProps={{
                style: { color: "#f1f1f1", backgroundColor: "#333" },
              }}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => loggin()}
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Ingresar
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Bienvenido, {userData.fullName}
            </Typography>
            <Typography variant="h3" gutterBottom>
              {userData.company}
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}
            >
              {/* <Button
                variant="contained"
                onClick={() => getMonthlySummary()}
                disabled={isPDFSummaryCreated}
                sx={{
                  backgroundColor: "#388e3c",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#2e7d32",
                  },
                }}
              >
                Generar Reporte Mensual
              </Button> */}

              <Button
                variant="outlined"
                href="/sales-of-month"
                fullWidth
                sx={{
                  color: "#fff",
                  borderColor: "#777",
                  "&:hover": { borderColor: "#bbb" },
                }}
              >
                Ir al Resumen Mensual
              </Button>

              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 1,
                  backgroundColor: "#333",
                  border: "1px solid #444",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={obtenerPDF}
                  sx={{
                    backgroundColor: "#f57c00",
                    "&:hover": {
                      backgroundColor: "#ef6c00",
                    },
                  }}
                >
                  Obtener Códigos de Barras
                </Button>

                {todoPiolon && (
                  <Box sx={{ mt: 4 }}>
                    <PDFDownloadLink
                      document={<PDFSummary summary={summary} />}
                      fileName="resumen-mensual.pdf"
                    >
                      {({ loading }) =>
                        loading ? (
                          <CircularProgress color="primary" />
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ mt: 2 }}
                          >
                            Descargar Resumen
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </Box>
                )}
                <Button
                  variant="contained"
                  onClick={() => getAllsProducts()}
                  disabled={isPdfCreated}
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "#1976d2",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  Generar Códigos QR
                </Button>

                {ok && (
                  <Box sx={{ mt: 3 }}>
                    <PDFDownloadLink
                      document={<PDFDocument products={products} />}
                      fileName="documento.pdf"
                    >
                      {({ loading }) =>
                        loading ? (
                          <CircularProgress color="primary" />
                        ) : (
                          <Button variant="contained" color="success" fullWidth>
                            Descargar Codigos de Barra
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export const stylesPDF = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: 20,
  },
  column: {
    padding: "20px",
    width: "32%",
    height: "30%",
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    marginBottom: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  textPrice: {
    marginVertical: 3,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  textOffer: {
    fontSize: 12,
    fontWeight: "medium",
    textAlign: "center",
  },
  qrCodeContainer: {
    width: "200px",
    height: "200px",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    border: "solid 1px black",
  },
});

interface Props1 {
  products: Product[];
}

const PDFDocument: FC<Props1> = ({ products }) => {
  return (
    <>
      <Document>
        {products
          .reduce((groups: Product[][], product: Product, index: number) => {
            const groupIndex = Math.floor(index / 9);

            if (!groups[groupIndex]) {
              // groups.push(dbproducts.slice(index, index + 9));
              groups[groupIndex] = [];
            }
            groups[groupIndex].push(product);
            return groups;
          }, [])
          .map((group: Product[], pageIndex: number) => (
            <Page key={pageIndex} style={stylesPDF.page}>
              {group.map((product: Product, productIndex: number) => {
                if (productIndex < 9) {
                  return (
                    <View key={product.id} style={stylesPDF.column}>
                      <View style={stylesPDF.qrCodeContainer}>
                        <Image
                          source={`http://api.qrserver.com/v1/create-qr-code/?data=${product.id}&size=50x50`}
                          style={{ marginBottom: 20 }}
                        />
                      </View>
                      <Text style={stylesPDF.title}>{product.title}</Text>
                      {/* <Text style={stylesPDF.textPrice}>
                        ${product.priceToSell}
                      </Text> */}
                    </View>
                  );
                }
                return null;
              })}
            </Page>
          ))}
      </Document>
    </>
  );
};

const PDFSummary = ({ summary }: { summary: MonthlySummary }) => {
  const labeels = JSON.stringify(
    summary.sales.map((sale) => sale.name.toString())
  );
  const totalData = JSON.stringify(summary.sales.map((sale) => sale.total));

  console.log(summary.sales[0].profits);

  const totalUnits = JSON.stringify(summary.sales.map((sale) => sale.cant));

  const graphTotal = `https://quickchart.io/chart?c={
    type:'horizontalBar',
    data:{
      labels:${labeels},
      datasets:[
        {
          label:'Pesos ($)',
          data:${totalData},
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'right',
        }
      }
    }
  }`;

  const graphUnits = `https://quickchart.io/chart?c={
    type:'horizontalBar',
    data:{
      labels:${labeels},
      datasets:[
        {
          label:'Unidades Vendidas',
          data:${totalUnits},
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        }
      ]
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'right',
        }
      }
    }
  }`;

  return (
    <>
      <Document>
        <Page style={stylesPDF.page}>
          <Text>Resumen del mes.()</Text>
          <View>
            <Image source={graphTotal} style={{ marginBottom: 20 }} />
          </View>
          <Image source={graphUnits} style={{ marginBottom: 20 }} />
        </Page>
      </Document>
    </>
  );
};
