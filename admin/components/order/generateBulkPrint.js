import jsPDF from "jspdf";
import "../../utils/fonts/SolaimanLipi-normal";
import { TodayDate } from "@/admin/utils/helpers";

function generateBulkPrintInvoice(invoiceArray) {
  console.log(invoiceArray);
  const doc = new jsPDF();
  const DEFAULT_FILENAME = TodayDate();

  invoiceArray.forEach((data, index) => {
    let item_01 = "",
      item_01_quantity = "",
      item_01_price = "",
      item_01_total_price = "",
      item_02 = "",
      item_02_quantity = "",
      item_02_price = "",
      item_02_total_price = "",
      item_03 = "",
      item_03_quantity = "",
      item_03_price = "",
      item_03_total_price = "",
      item_04 = "",
      item_04_quantity = "",
      item_04_price = "",
      item_04_total_price = "",
      item_05 = "",
      item_05_quantity = "",
      item_05_price = "",
      item_05_total_price = "",
      item_06 = "",
      item_06_quantity = "",
      item_06_price = "",
      item_06_total_price = "";

    data.order.map((e, i) => {
      i++;
      if (i === 1) {
        item_01 = e.title || "";
        item_01_quantity = `${e.quantity}`;
        item_01_price = [e.price];
        item_01_total_price = `${e.total_price}/-`;
      } else if (i === 2) {
        item_02 = e.title || "";
        item_02_quantity = `${e.quantity}`;
        item_02_price = [e.price];
        item_02_total_price = `${e.total_price}/-`;
      } else if (i === 3) {
        item_03 = e.title || "";
        item_03_quantity = `${e.quantity}`;
        item_03_price = [e.price];
        item_03_total_price = `${e.total_price}/-`;
      } else if (i === 4) {
        item_04 = e.title || "";
        item_04_quantity = `${e.quantity}`;
        item_04_price = [e.price];
        item_04_total_price = `${e.total_price}/-`;
      } else if (i === 5) {
        item_05 = e.title || "";
        item_05_quantity = `${e.quantity}`;
        item_05_price = [e.price];
        item_05_total_price = `${e.total_price}/-`;
      } else if (i === 6) {
        item_06 = e.title || "";
        item_06_quantity = `${e.quantity}`;
        item_06_price = [e.price];
        item_06_total_price = `${e.total_price}/-`;
      }
    });

    doc.setFont("SolaimanLipi");
    doc.addImage("/invoice/invoice.jpg", 0, 0, 210, 297);
    doc.text(`${index + 1}`, 3, 294); // Title
    doc.text(data?.status, 91, 77);
    doc.text(data?.customer_details.customer_name, 33, 91.4);
    doc.text(data?.customer_details.phone_number, 33.3, 99);

    doc.text(item_01, 30, 139.6);
    doc.text(item_01_quantity, 116, 139.6);
    doc.text(item_01_price, 137, 139.6);
    doc.text(item_01_total_price, 168, 139.6);

    doc.text(item_02, 30, 154);
    doc.text(item_02_quantity, 116, 154);
    doc.text(item_02_price, 137, 154);
    doc.text(item_02_total_price, 168, 154);

    doc.text(item_03, 30, 167);
    doc.text(item_03_quantity, 116, 167);
    doc.text(item_03_price, 137, 167);
    doc.text(item_03_total_price, 168, 167);

    doc.text(item_04, 30, 180.8);
    doc.text(item_04_quantity, 116, 180.8);
    doc.text(item_04_price, 137, 180.8);
    doc.text(item_04_total_price, 168, 180.8);

    doc.text(item_05, 30, 194.6);
    doc.text(item_05_quantity, 116, 194.6);
    doc.text(item_05_price, 137, 194.6);
    doc.text(item_05_total_price, 168, 194.6);

    doc.text(item_06, 30, 208.2);
    doc.text(item_06_quantity, 116, 208.2);
    doc.text(item_06_price, 137, 208.2);
    doc.text(item_06_total_price, 168, 208.2);

    doc
      .setFontSize(12)
      .text(`[Note: ${data?.customer_details?.invoice_Note || ""}]`, 8, 218.2, {
        maxWidth: 120,
        align: "left",
      });
    doc.text(`${data?.totalPrice}/-`.toString(), 161, 225.5);
    doc.text("Home", 182, 233.8);
    doc.text(`${data?.deliveryCrg}/-`, 161, 233.8);
    doc.text(`-${data?.discount}/-`.toString(), 161, 242.2);

    doc
      .setFontSize(12)
      .text(data?.customer_details.customer_address, 36.4, 106.5, {
        maxWidth: 165,
        align: "left",
      });
    doc.text(data?.date, 93, 83.5);
    doc.setFont("SolaimanLipi", "bold");
    doc.setFontSize(16).text(data?.id, 43, 83.5);
    doc
      .setFontSize(18)
      .text(`${data?.customer_details?.salePrice.toString()}.00/-`, 161, 255.5);

    // Add a new page unless it's the last data
    if (index < invoiceArray.length - 1) {
      doc.setFont(undefined, "normal");
      doc.addPage();
    }
  });

  // Save the PDF
  doc.save(`Bulk-Order(${invoiceArray.length})_${DEFAULT_FILENAME}.pdf`);
  // doc.save(data?.id);
  doc.autoPrint();
  //This is a key for printing
  doc.output("dataurlnewwindow");

  // OR open it in a new tab for direct printing
  // doc.output('dataurlnewwindow');
}

export default generateBulkPrintInvoice;
