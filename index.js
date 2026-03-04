import express from "express"
import nodemailer from "nodemailer"
import bodyParser from "body-parser";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // 465 for SSL, 587 for TLS
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail ID
      pass: process.env.EMAIL_PASS, // Use App Password, not your actual Gmail password
    },
  });
  
const corsOptions = {
    origin: ["https://www.athivee.com","http://localhost:8081","https://athivee.com"],
    credentials: true,
    methods: "GET,POST,PUT,DELETE"
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended:true}));


app.post("/contactUs", async (req, res) => {

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    
        <div style="max-width:600px; margin:auto; background:white; border-radius:8px; padding:25px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            
            <h2 style="color:#2c3e50; text-align:center;">
                New Enquiry from Athivee Website
            </h2>

            <hr style="margin:20px 0;"/>

            <table style="width:100%; border-collapse:collapse; font-size:15px;">
                <tr>
                    <td style="padding:8px; font-weight:bold;">Name</td>
                    <td style="padding:8px;">${req.body.name}</td>
                </tr>

                <tr style="background:#f9fafb;">
                    <td style="padding:8px; font-weight:bold;">Phone</td>
                    <td style="padding:8px;">${req.body.phone}</td>
                </tr>

                <tr>
                    <td style="padding:8px; font-weight:bold;">Email</td>
                    <td style="padding:8px;">${req.body.email}</td>
                </tr>
            </table>

            <div style="margin-top:20px;">
                <h4 style="margin-bottom:10px;">Message</h4>
                <div style="background:#f4f6f8; padding:15px; border-radius:6px;">
                    ${req.body.message}
                </div>
            </div>

            <hr style="margin:25px 0;"/>

            <p style="font-size:12px; color:#888; text-align:center;">
                This enquiry was submitted from the Athivee website contact form.
            </p>

        </div>

    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: "axiondevsoft@gmail.com",
            to: "axiondevsoft@gmail.com, services@athivee.com",
            subject: "Athivee:- New Enquiry",
            html: htmlContent   // 👈 use html instead of text
        });

        res.status(200).json({ success: true, message: "Email sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

app.listen(port,()=>{
    console.log("Server running in port 3000");
})

