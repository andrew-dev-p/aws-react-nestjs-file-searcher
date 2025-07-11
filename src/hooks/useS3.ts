import { axiosClient } from "@/lib/axios";
import { toast } from "sonner";
import { AllowedType } from "@/lib/consts";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useS3 = () => {
  const getUploadUrl = async (filename: string, type: AllowedType) => {
    if (!Object.values(AllowedType).includes(type)) {
      toast.error("Invalid file type");
      return;
    }
    const response = await axiosClient.get(
      `/upload/upload-url?key=${filename}&contentType=${type}`
    );
    return response.data.url;
  };

  const getUploadUrlMutation = useMutation({
    mutationFn: ({ filename, type }: { filename: string; type: AllowedType }) =>
      getUploadUrl(filename, type),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to get upload URL"
      );
    },
  });

  const uploadFile = async (file: File, url: string) => {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return response.data;
  };

  const uploadFileMutation = useMutation({
    mutationFn: ({ file, url }: { file: File; url: string }) =>
      uploadFile(file, url),
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload file"
      );
    },
  });

  const getDeleteUrl = async (filename: string) => {
    const response = await axiosClient.get(
      `/upload/delete-url?key=${filename}`
    );
    return response.data.url;
  };

  const getDeleteUrlMutation = useMutation({
    mutationFn: getDeleteUrl,
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to get delete URL"
      );
    },
  });

  const deleteFile = async (url: string) => {
    const response = await axios.delete(url);
    return response.data;
  };

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
  });

  return {
    getUploadUrlMutation,
    uploadFileMutation,
    getDeleteUrlMutation,
    deleteFileMutation,
  };
};
