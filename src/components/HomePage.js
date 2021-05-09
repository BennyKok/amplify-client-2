import React, { useEffect, useState } from 'react';
import { handleError, message } from '../Utils'
// import HorizontalHeader from "./HorizontalHeader.js";
import {
  PackagePopup,
  PackageItem,
  PackageLoadingIndicator,
  LoadMoreSection,
} from './PackageComponent.js';
import { GetPackage, LoadMorePackages } from '../Store';

const { ipcRenderer } = require('electron');

export default function HomePage() {
  const [packages, setPackages] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    if (selectedPackage) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedPackage]);

  useEffect(() => {
    if (!packages) GetPackage(setPackages, 0);
  }, []);

  const [projectPath, setProjectPath] = useState(null);

  ipcRenderer.on('on-update-project-path', (event, arg) => {
    setProjectPath(arg);
  });

  return (
    <div className="h-full">
      {/* <HorizontalHeader title="Explore all packages" /> */}
      <div className={'h-full mt-4 container mx-auto px-4 flex flex-col justify-center'}>
        <div
          className={`flex flex-row justify-between rounded-lg shadow-md h-24 border dark:bg-gray-500 pl-4 mb-4`}
        >
          <div className="items-center self-center text-white">
            Project path: {projectPath}
          </div>
          <button
            onClick={async () => {
              ipcRenderer.send('on-update-project-path');
            }}
            className="mt-2 mb-2 mr-4 self-center items-center shadow-sm flex bg-transparent hover:bg-blue-500 text-white dark:text-gray-900 font-semibold hover:text-white py-2 px-4 border dark:border-gray-700 border-white hover:border-transparent rounded transition-transform duration-75 transform hover:scale-105 sm:motion-reduce:hover:animate-none"
          >
            Set project
          </button>
        </div>
        {packages && packages.length >= 0 ? (
          <div
            className={
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full pb-10'
            }
          >
            {packages.map((_package, index) => (
              <PackageItem
                _package={_package}
                key={_package.id}
                onClick={async () => {

                    if (!projectPath) {
                        message('No project path')
                        return
                    }

                    const packageNameUri = encodeURIComponent(_package.name);
                    const res = await fetch(`https://amplify-project.vercel.app/api/download-package?packageId=${_package.id}&packageName=${packageNameUri}`);
                    let downloadUrlData;
                    if (res) {
                        downloadUrlData = await res.json();
                    } else {
                        toast(res, {
                            position: "bottom-right",
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: true,
                            progress: undefined,
                        });
                        return;
                    }
                    const a = document.createElement('a');
                    a.href = downloadUrlData.fbxDownloadUrl;
                    a.click();
                    a.remove()
                }}
              />
            ))}
          </div>
        ) : (
          <PackageLoadingIndicator />
        )}
      </div>

      <LoadMoreSection
        loadMore={() => {
          LoadMorePackages(setPackages, packages);
        }}
      />

      {/* <div className="fixed z-10">
                <PackagePopup
                    selectedPackage={selectedPackage}
                    onCancel={() => {
                        setSelectedPackage(null);
                    }}
                />
            </div> */}
    </div>
  );
}
