// @ts-nocheck
import EXIF from 'exif-js';

export function readExifData(file: File): Promise<string> {
  return new Promise((resolve) => {
    try {
      EXIF.getData(file, function () {
        const make = EXIF.getTag(this, "Make");
        const model = EXIF.getTag(this, "Model");
        const fNumber = EXIF.getTag(this, "FNumber");
        const exposureTime = EXIF.getTag(this, "ExposureTime");
        const iso = EXIF.getTag(this, "ISOSpeedRatings");
        const focalLength = EXIF.getTag(this, "FocalLength");

        if (!fNumber && !exposureTime && !iso && !focalLength) {
          resolve("No EXIF data found.");
          return;
        }

        let parts = [];
        if (fNumber) parts.push(`f/${fNumber.valueOf()}`);
        if (exposureTime) {
            const et = exposureTime.valueOf();
            if (et < 1) {
                parts.push(`1/${1/et}s`);
            } else {
                parts.push(`${et}s`);
            }
        }
        if (iso) parts.push(`ISO ${iso}`);
        if (focalLength) parts.push(`${focalLength.valueOf()}mm`);

        let exifString = parts.join(' | ');
        if (model) {
            exifString += ` (${make ? make + ' ' : ''}${model})`;
        } else if (make) {
            exifString += ` (${make})`
        }

        resolve(exifString);
      });
    } catch (error) {
      console.warn("Could not read EXIF data:", error);
      resolve("EXIF data could not be read.");
    }
  });
}
