/** Registry of qualified directional controllers; preset paths remain separate. */
import type { MegaInventoryDevice } from "./inventory-normalization.js";
import type { PpcsStreamRoute } from "./eufy-provider.js";
import type { PanTiltController, PpcsControlTransport } from "../stream/pan-tilt-controller.js";
import { T8410 } from "../stream/t8410-pan-tilt.js";
import { C37 } from "../stream/c37-pan-tilt.js";

export interface PanTiltDevice {
  readonly requiresOwnerAccount: boolean;
  readonly connectionPath: "homebase" | "standalone-queue";
  supports(device: MegaInventoryDevice, route: PpcsStreamRoute | null): boolean;
  new(transport: PpcsControlTransport, channel: number): PanTiltController;
}

const PAN_TILT_DEVICES: readonly PanTiltDevice[] = [T8410, C37];

export function panTiltDevice(device: MegaInventoryDevice, route: PpcsStreamRoute | null): PanTiltDevice | null {
  return PAN_TILT_DEVICES.find(Device => Device.supports(device, route)) ?? null;
}
