
import { jsPDF } from "jspdf";
import { TreatmentPlan } from "../types";

export const generateTreatmentPlanPDF = (plan: TreatmentPlan) => {
    const doc = new jsPDF();

    // --- Colors & Fonts ---
    const primaryColor = '#a855f7'; // Purple-ish
    const darkColor = '#333333';

    // --- Header ---
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, 210, 40, 'F'); // Header background

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(primaryColor);
    doc.text("DIVA", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(darkColor);
    doc.text("Aesthetics & Spa", 20, 25);

    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.text(`Orçamento: #${plan.id.slice(-6).toUpperCase()}`, 150, 25);

    // --- Title ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Plano de Tratamento", 20, 60);

    // --- Client Info ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Paciente: ${plan.clientName}`, 20, 75);
    doc.text(`Profissional: ${plan.professionalName || 'Dra. Responsável'}`, 20, 82);

    // --- Table Header ---
    const startY = 100;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, startY - 8, 170, 10, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Serviço", 25, startY);
    doc.text("Qtd", 120, startY);
    doc.text("Valor Unit.", 140, startY);
    doc.text("Total", 170, startY);

    // --- Table Content ---
    let currentY = startY + 10;
    doc.setFont("helvetica", "normal");

    plan.items.forEach((item) => {
        doc.text(item.serviceName, 25, currentY);
        doc.text(item.quantity.toString(), 120, currentY);

        const unitPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice);
        const total = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice);

        doc.text(unitPrice, 140, currentY);
        doc.text(total, 170, currentY);

        doc.setDrawColor(240, 240, 240);
        doc.line(20, currentY + 3, 190, currentY + 3);

        currentY += 10;
    });

    // --- Totals ---
    const totalY = currentY + 10;
    doc.line(20, totalY, 190, totalY); // Separator

    doc.setFont("helvetica", "bold");
    doc.text(`Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.total)}`, 160, totalY + 10);

    // --- Notes/Footer ---
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Validade da proposta: 15 dias.", 20, totalY + 30);
    doc.text("Este documento não substitui o contrato de prestação de serviços.", 20, totalY + 35);

    // --- Signature ---
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 270, 90, 270);
    doc.line(120, 270, 190, 270);
    doc.text("Profissional", 20, 275);
    doc.text("Paciente", 120, 275);

    // --- Save ---
    doc.save(`Plano_${plan.clientName.replace(/\s+/g, '_')}.pdf`);
};
