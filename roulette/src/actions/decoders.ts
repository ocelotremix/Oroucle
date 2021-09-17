import { deserializeUnchecked } from 'borsh';
import {
  Honeypot,
  RNG,
  RouletteBet,
} from './state'

import { schema } from './schema'

export const decodeRNG = (buffer: Buffer) => {
  return deserializeUnchecked(schema, RNG, buffer) as RNG;
};

export const decodeHoneypot = (buffer: Buffer) => {
  return deserializeUnchecked(schema, Honeypot, buffer) as Honeypot;
};

export const decodeRouletteBet = (buffer: Buffer) => {
  return deserializeUnchecked(schema, RouletteBet, buffer) as RouletteBet;
};