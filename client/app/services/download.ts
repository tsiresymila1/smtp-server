import { saveAs } from "file-saver";
import contentDisposition from "content-disposition";
import axios from "axios";
import { toast } from "react-toastify";
export const downloadAttachment = (token: string, id: number) => {
  const donwloadApi = axios.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  donwloadApi
    .get(`/download/${id}`, {
      responseType: "blob",
    })
    .then((response) => {
      let filename = contentDisposition.parse(
        response.headers["content-disposition"]
      ).parameters.filename;
      saveAs(response.data, filename);
    })
    .catch((error) => {
      toast.error(error);
    });
};
