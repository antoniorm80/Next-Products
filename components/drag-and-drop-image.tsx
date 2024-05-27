'use client'

import { fileToBase64 } from "@/actions/convert-file-to-base64";
import { Dropzone, ExtFile, FileMosaic, FileMosaicProps } from "@files-ui/react";
import * as React from "react";

export default function DragAndDropImage({ handleImage } : { handleImage: (url: string) => void }) {

  const [files, setFiles] = React.useState<ExtFile[]>([]);
  
  const updateFiles = async (incommingFiles: ExtFile[]) => {

    // ===== Get the file, conver to base64 and use "handleImage" function to update the form  =====
    const file = incommingFiles[0].file as File;
    const base64 = await fileToBase64(file);
    
    handleImage(base64);
   
    setFiles(incommingFiles);
    
  };
  const removeFile = (id: FileMosaicProps["id"]) => {
    handleImage('');
    setFiles(files.filter((x) => x.id !== id));
  };
  return (
    <Dropzone
      onChange={updateFiles}
      value={files}
      header={true}
      footer={true}
      label="Agregar imagen"      
      accept=".webp, .png, .jpg, .jpeg/*"
      maxFiles={1}
      minHeight="150px"
    >
      {files.map((file) => (
        <FileMosaic 
        key={file.id} 
        {...file} 
        onDelete={removeFile} 
        preview
        resultOnTooltip
        alwaysActive />
      ))}
    </Dropzone>
  );
}
