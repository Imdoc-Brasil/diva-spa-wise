
import jsPDF from 'jspdf';
import { Course } from '../types';

export const generateCertificate = (course: Course, studentName: string) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Background params
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Decorative Border (Double Line)
    doc.setDrawColor(184, 134, 11); // Dark Golden Rod
    doc.setLineWidth(3);
    doc.rect(10, 10, width - 20, height - 20);

    doc.setDrawColor(218, 165, 32); // Golden Rod
    doc.setLineWidth(1);
    doc.rect(13, 13, width - 26, height - 26);

    // Corner Ornaments (Simplified as circles)
    doc.setFillColor(184, 134, 11);
    doc.circle(13, 13, 2, 'F');
    doc.circle(width - 13, 13, 2, 'F');
    doc.circle(13, height - 13, 2, 'F');
    doc.circle(width - 13, height - 13, 2, 'F');

    // Branding / Header
    // Ideally put a logo here, but text for now
    doc.setFont("times", "bold");
    doc.setFontSize(48);
    doc.setTextColor(40, 40, 40);
    doc.text("Diva Academy", width / 2, 45, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("CERTIFICADO DE EXCELÊNCIA", width / 2, 65, { align: "center" });

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 80, 75, width / 2 + 80, 75);

    // Body
    doc.setFont("times", "normal");
    doc.setFontSize(22);
    doc.setTextColor(60, 60, 60);
    doc.text("Certificamos que", width / 2, 95, { align: "center" });

    // Student Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(42);
    doc.setTextColor(184, 134, 11); // Gold Color
    doc.text(studentName, width / 2, 115, { align: "center" });

    // Concluded Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(60, 60, 60);
    doc.text("concluiu satisfatoriamente o curso de capacitação profissional em", width / 2, 135, { align: "center" });

    // Course Title
    doc.setFont("times", "bold");
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.text(course.title, width / 2, 155, { align: "center" });

    // Details (Workload, Instructor)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const details = `Carga Horária: ${course.duration || 'N/A'}  •  Instrutor: ${course.instructor}`;
    doc.text(details, width / 2, 170, { align: "center" });

    // Date
    const today = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(14);
    doc.text(today, width / 2, 195, { align: "center" });

    // Signatures
    const sigY = 235;

    // CEO Signature
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(50, sigY, 110, sigY);
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Diretoria Diva Spa", 80, sigY + 6, { align: "center" });

    // Instructor Signature (Simulated)
    doc.line(width - 110, sigY, width - 50, sigY);
    doc.text(course.instructor, width - 80, sigY + 6, { align: "center" });

    // Verification Code (Fake)
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Código de Verificação: ${code}`, 15, height - 8);

    // Save
    doc.save(`Certificado_Diva_${course.title.replace(/\s+/g, '_')}.pdf`);
};
