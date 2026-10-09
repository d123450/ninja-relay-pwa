/*! Extracted and adapted from VDO.Ninja SDK v1.6.2.
 * Copyright (c) 2025-2026 Steve Seguin. All rights reserved.
 * Modifications: Ninja Relay contributors, 2026.
 * SPDX-License-Identifier: MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Source: steveseguin/ninjasdk, commit
 * 2a846f37512e711ca3ab9be8fb391a867d0614e9, vdoninja-sdk.js:
 * _buildCodecPreferenceList, _preferCodecOnSender,
 * _applySenderEncodingParameters.
 * Adaptations: standalone exports; retain every fallback/RTX codec;
 * only bitrate/framerate controls; propagate encoding errors; never
 * invent an encoding after negotiation. No SDK runtime is included.
 */

export function codecPreferenceList(codecs, requestedCodec) {
  if (!Array.isArray(codecs) || !requestedCodec) return null;
  const target = requestedCodec.toLowerCase();
  const primary = [], associated = [], fallback = [];
  for (const codec of codecs) {
    const mime = (codec?.mimeType || '').toLowerCase();
    if (mime === target) primary.push(codec);
    else if (mime.endsWith('/rtx')) associated.push(codec);
    else fallback.push(codec);
  }
  if (!primary.length) return null;
  // Browser capabilities often omit apt/preferredPayloadType. Keep RTX and
  // all fallback codecs so WebRTC can negotiate the supported intersection.
  return [...primary, ...associated, ...fallback];
}

export function preferCodec(transceiver, kind, codec) {
  if (typeof transceiver?.setCodecPreferences !== 'function' ||
      typeof globalThis.RTCRtpSender?.getCapabilities !== 'function') return false;
  const codecs = RTCRtpSender.getCapabilities(kind)?.codecs;
  const preference = codecPreferenceList(codecs, `${kind}/${codec}`);
  if (!preference) return false;
  try { transceiver.setCodecPreferences(preference); return true; }
  catch { return false; } // Browser's native ordering is a valid fallback.
}

export async function applyEncoding(sender, { maxBitrate, maxFramerate }) {
  const params = sender.getParameters();
  if (!params.encodings?.length) throw Error('编码器尚未就绪。');
  for (const encoding of params.encodings) {
    if (Number.isFinite(maxBitrate)) encoding.maxBitrate = maxBitrate;
    if (Number.isFinite(maxFramerate)) encoding.maxFramerate = maxFramerate;
  }
  await sender.setParameters(params);
}
