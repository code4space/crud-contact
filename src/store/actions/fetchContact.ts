import { baseUrl } from "@/constant/url";
import { CONTACT } from "./actionType";
import { swalError } from '@/components/swal'
import axios from "axios";

export function contactFetchSuccess(payload: object) {
  return {
    type: CONTACT,
    payload,
  };
}

export function getContact(): any {
  return async (dispatch: Function) => {
    try {
      const response = await axios({
        url: baseUrl,
        method: 'GET',
      })

      dispatch(contactFetchSuccess(response.data));
    } catch (error) {
      swalError(error)
    }
  };
}