import React, { Suspense, useRef, createRef } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom';
// import icon from '../assets/icon.svg';
import '../App.global.css';

import { v4 as uuidv4 } from 'uuid';

import LoginPage from './LoginPage';
import Navbar from './Navbar.js';

import { toast } from 'react-toastify';
const Buffer = require('buffer/').Buffer;
import fs from 'fs';

import '../model-viewer.min.js';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const tmp = require('tmp');

import { handleError } from '../Utils';
import { supabase } from '../Store';

import path from 'path';

const { exec } = require('child_process');

export const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event: any) => {
        setValue(event.target.value);
      },
    },
  };
};

export default function UploadPage(props: any) {
  const [filePath, setFilePath] = useState('');
  const [fbxFilePath, setFBXFilePath] = useState('');
  const {
    value: packageName,
    bind: bindPackageName,
    reset: resetPackageName,
  } = useInput('');
  const style =
    'px-2 py-2 placeholder-gray-400 text-gray-700 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full';

  const ref = createRef();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);

    const targetPath: string = file.path;
    setFBXFilePath(targetPath);

    if (targetPath.endsWith('.fbx')) {
      console.log('Converting...');
      let fbx2gltfBinary = '';

      switch (process.platform) {
        case 'win32':
          fbx2gltfBinary = path.join(
            path.dirname(__dirname),
            'FBX2glTF',
            'FBX2glTF-win.exe'
          );
          break;
        case 'darwin':
          fbx2gltfBinary = path.join(
            path.dirname(__dirname),
            'FBX2glTF',
            'FBX2glTF-mac-x64'
          );
          break;
      }

      const tempPath = window.tempPath;
      const tempName = path.basename(tmp.tmpNameSync());
      console.log(tempName);

      const outputPath = path.join(tempPath, `${tempName}.glb`);
      console.log(fbx2gltfBinary);
      const script = `${file.path} -o ${outputPath}`;
      exec(`${fbx2gltfBinary} ${script}`, (error: any, stdout: any) => {
        console.log(`error: ${error}`);
        console.log(`stdout: ${stdout}`);
        setFilePath(outputPath);
      });
    } else {
      setFilePath(targetPath);
    }

    console.log(file.path);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (uploadUrl: any, file: any) => {
    const { url, fields } = uploadUrl;
    const data = {
      ...fields,
      file: file,
    };
    const formData = new FormData();
    for (const name in data) formData.append(name, data[name]);
    const res1 = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    console.log(res1);
  };

  const upload = async () => {
    // const fileSize = files.reduce((accumulator, x) => accumulator + x.size, 0);
    // if (fileSize > 52428800) {
    //     toast('File too large, < 50', {
    //         position: "bottom-right",
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //     });
    //     console.log("Files too large");
    //     return;
    // }

    // const url = ref.current.toDataURL();
    const image = await ref.current.toBlob();
    const imageFiles: Blob[] = [];
    imageFiles.push(image);

    setUploading(true);
    let userID = props.user.id;
    console.log(userID);
    console.log(imageFiles);
    // console.log(files);
    const packageId = uuidv4();

    // Create image key
    const imageCount = encodeURIComponent(imageFiles.length);
    const res = await fetch(
      `https://amplify-project.vercel.app/api/upload-url?packageId=${packageId}&imageCount=${imageCount}`
    );
    console.log(res);
    let uploadUrlData;
    if (res) {
      uploadUrlData = await res.json();
      console.log(uploadUrlData);
    } else {
      toast(res, {
        position: 'bottom-right',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setUploading(false);
      return;
    }

    let imagesKey = [];
    for (let index = 0; index < imageFiles.length; index++) {
      const imageKey = '_images_' + index;
      imagesKey.push(imageKey);
    }

    const { data, error } = await supabase.from('packages').insert([
      {
        id: packageId,
        name: packageName,
        description: 'No Description',
        user_id: userID,
        images: JSON.stringify(imagesKey),
      },
    ]);

    console.log(data);
    console.log(error);

    handleError(error);
    if (error) {
      setUploading(false);
      return;
    }

    // Upload Images
    for (let i = 0; i < uploadUrlData.imageUploadUrl.length; i++) {
      const file = imageFiles[i];
      const { url, fields } = uploadUrlData.imageUploadUrl[i];

      const data = {
        ...fields,
        file: file,
      };

      const formData = new FormData();
      for (const name in data) formData.append(name, data[name]);

      const res1 = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log(res1);
    }

    // Upload fbx

    const fbxFileBuffer = fs.readFileSync(fbxFilePath);
    const glbFileBuffer = fs.readFileSync(filePath);

    var fbxFileBlob = new Blob([fbxFileBuffer]);
    var glbFileBlob = new Blob([glbFileBuffer]);

    await uploadFiles(uploadUrlData.fbxUploadUrl, fbxFileBlob);
    await uploadFiles(uploadUrlData.glbUploadUrl, glbFileBlob);

    setUploading(false);

    if (!error)
      toast('🦄 Wow so easy! Uploaded!', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

    resetPackageName();
    // resetDescription();
    // setImageFiles([]);
    // setModelFiles([]);
    // setFiles([]);
  };

  return (
    <Suspense fallback={<div>Loading</div>}>
      <div className="container mx-auto px-4 mt-8">
        <div className="flex items-center justify-center">
          <form
            className="w-full md:w-3/5 lg:w-3/6 flex flex-col"
            onSubmit={async (e) => {
              e.preventDefault();
              upload();
            }}
          >
            {filePath && filePath.length > 0 ? (
              <div className="flex flex-col w-full">
                <button
                  onClick={() => {
                    setFilePath('');
                  }}
                  className="mt-2 mb-2 self-end items-center shadow-sm flex bg-transparent hover:bg-blue-500 text-white dark:text-gray-900 font-semibold hover:text-white py-2 px-4 border dark:border-gray-700 border-white hover:border-transparent rounded"
                >
                  Clear
                </button>

                <model-viewer
                  ref={ref}
                  class="w-auto"
                  src={filePath}
                  alt="Preview"
                  auto-rotate
                  camera-controls
                ></model-viewer>

                <label className="mb-3 pt-2">
                  <div className="mb-2 font-bold text-white">Model Name</div>
                  <input
                    type="text"
                    required={true}
                    placeholder="My awesome model name"
                    className={style}
                    {...bindPackageName}
                  />
                </label>
              </div>
            ) : (
              <section className="container pt-2">
                {/* <div className="mb-2 font-bold text-white">Images</div> */}
                <div {...getRootProps({ className: 'dropzone text-white' })}>
                  <input {...getInputProps()} />
                  {/* required={true} */}
                  <p>Drag 'n' drop fbx file here, or click to select file</p>
                </div>
                {/* <aside style={thumbsContainer}>{thumbs}</aside> */}
              </section>
            )}

            <button
              type="submit"
              className="mt-2 mb-4 self-end items-center shadow-sm flex bg-transparent hover:bg-blue-500 text-white dark:text-gray-900 font-semibold hover:text-white py-2 px-4 border dark:border-gray-700 border-white hover:border-transparent rounded"
            >
              <svg
                className={
                  uploading ? 'animate-spin h-5 w-5 mr-3' : 'invisible'
                }
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submit
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
}
