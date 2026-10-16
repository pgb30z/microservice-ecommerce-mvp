import {
  ShipmentRepository,
} from "../../infrastructure/repositories/ShipmentRepository.js";

export class UpdateShipmentStatus {
  constructor() {
    this.shipmentRepository =
      new ShipmentRepository();
  }

  async execute({
    shipid,
    status,
  }) {
    shipid =
      Number(shipid);

    status =
      String(status || "")
        .trim();

    if (!shipid) {
      throw new Error(
        "Shipment ID is required"
      );
    }

    if (!status) {
      throw new Error(
        "Shipment status is required"
      );
    }

    const shipment =
      await this.shipmentRepository
        .updateStatus(
          shipid,
          status
        );

    if (!shipment) {
      throw new Error(
        "Shipment not found"
      );
    }

    return shipment;
  }
}