import {
  ShipmentRepository,
} from "../../infrastructure/repositories/ShipmentRepository.js";

export class GetShipment {
  constructor() {
    this.shipmentRepository =
      new ShipmentRepository();
  }

  async execute(shipid) {
    const shipment =
      await this.shipmentRepository
        .findByShipId(
          Number(shipid)
        );

    if (!shipment) {
      throw new Error(
        "Shipment not found"
      );
    }

    return shipment;
  }
}