import {
  ShipmentRepository,
} from "../../infrastructure/repositories/ShipmentRepository.js";

export class GetShipmentByOrder {
  constructor() {
    this.shipmentRepository =
      new ShipmentRepository();
  }

  async execute(oid) {
    const shipment =
      await this.shipmentRepository
        .findByOrderId(
          Number(oid)
        );

    if (!shipment) {
      throw new Error(
        "Shipment not found"
      );
    }

    return shipment;
  }
}