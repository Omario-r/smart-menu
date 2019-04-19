import { SET_HEADER } from './constants';

export function setHeader(header) {
  header.back = header.back || false;
  return {
    type: SET_HEADER,
    header,
  }
}
