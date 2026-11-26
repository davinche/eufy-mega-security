/** C37 directional protocol; provider retains owner admission and isolated-session ownership. */
import type { MegaInventoryDevice } from "../provider/inventory-normalization.js";
import type { PpcsStreamRoute } from "../provider/eufy-provider.js";
import { PanTiltController, type PpcsControlTransport, type PanTiltDirection } from "./pan-tilt-controller.js";

export class C37 extends PanTiltController {
  static readonly requiresOwnerAccount = true;
  // Keep Mega's existing queue while viewer reuse remains unverified.
  static readonly connectionPath = "standalone-queue";
  constructor(transport: PpcsControlTransport, channel: number) { super("C37", transport, channel); }

  static supports(device: MegaInventoryDevice, route: PpcsStreamRoute | null): boolean {
    const identity = device.model === "T814X" && device.deviceType === 10037 && device.category === "eufy_security";
    if (!identity || device.channel !== 0 || !device.adminUserId) return false;
    if (!route || route.homeBaseAttached || route.peer.serial !== device.serial) return false;
    return route.peer.adminUserId === device.adminUserId;
  }

  protected commandValue(direction: PanTiltDirection): string {
    return JSON.stringify({ commandType: 6030, data: { cmd_type: 1,
      rotate_type: { left: 1, right: 2, up: 3, down: 4 }[direction],
      zoom: 1, ivalue: -1, transaction: `${Date.now()}` } });
  }

  protected movementResult(header: Buffer, payload: Buffer, _type: number): number | null {
    if (header.length !== 16) return null;
    return this.transport.decodeResult(header, payload, 1700, this.channel);
  }
}
