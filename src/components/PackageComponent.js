import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
// import Viewer from "react-viewer";
// import DayJS from "react-dayjs";
// import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { toast } from "react-toastify";

export function PackageLoadingIndicator(props) {
  return (
    <div
      className={
        "fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-30 mt-14 lg:mt-20"
      }
    >
      <div className="absolute w-96 h-32 bg-white dark:bg-gray-500 dark:text-white rounded-md shadow-lg flex items-center justify-center text-2xl">
        Loading Packages...
      </div>
    </div>
  );
}

function removeExtension(filename){
    var lastDotPosition = filename.lastIndexOf(".");
    if (lastDotPosition === -1) return filename;
    else return filename.substr(0, lastDotPosition);
}

// export function PackagePopup(props) {
//   const [imgs, setImgs] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [files, setFiles] = useState([]);

//   const getImages = async () => {
//     if (props.selectedPackage == null) return;
//     const imgs = [];
//     const images = JSON.parse(props.selectedPackage.images);
//     if (images) {
//       for (let index = 0; index < images.length; index++) {
//         const img = props.selectedPackage.id + images[index];
//         imgs.push("https://d3evhy8mwh3ep4.cloudfront.net/" + img);
//       }
//       setImgs(imgs);
//     }
//   };

//   useEffect(() => {
//     setImgs(null);
//     setIsOpen(false);
//     setFiles([]);
//     if (props.selectedPackage != null) {
//       getImages();

//       if (props.selectedPackage.files != null) {
//         console.log(props.selectedPackage.files);
//         const list = [];
//         props.selectedPackage.files.map((x) => {
//           list.push(JSON.parse(x));
//         });
//         setFiles(list);
//       }
//     }
//   }, [props.selectedPackage]);

//   return (
//     <div>
//       <Transition
//         show={props.selectedPackage !== null}
//         enter="transition-opacity duration-75"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="transition-opacity duration-150"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       >
//         {props.selectedPackage ? (
//           <div>
//             <Viewer
//               drag={false}
//               noClose={true}
//               visible={isOpen}
//               noImgDetails={true}
//               onClose={() => {
//                 setIsOpen(false);
//               }}
//               onMaskClick={() => {
//                 setIsOpen(false);
//               }}
//               images={imgs ? imgs.map((x) => ({ src: x })) : null}
//             />
//             <div
//               className={
//                 "fixed w-screen h-screen top-0 flex items-center justify-center transition-opacity z-20"
//               }
//               // {...props}
//             >
//               <div
//                 className="absolute w-screen h-screen bg-black opacity-25 cursor-pointer"
//                 onClick={props.onCancel}
//               ></div>

//               <OverlayScrollbarsComponent
//                 className="container max-w-5xl dark:text-white absolute rounded-lg bg-white dark:bg-gray-500 shadow-lg flex flex-col text-2xl overflow-y-auto"
//                 style={{ height: "80%" }}
//               >
//                 <div>
//                   {imgs && imgs.length > 0 ? (
//                     <img
//                       onClick={() => {
//                         setIsOpen(true);
//                       }}
//                       src={imgs[0]}
//                       className="rounded-t-lg w-full object-scale-down object-center bg-gray-100 dark:bg-gray-400"
//                       style={{ height: "40rem" }}
//                     ></img>
//                   ) : (
//                     <div
//                       className="h-2/5 rounded-t-lg w-full bg-gray-100 dark:bg-gray-400"
//                       style={{ height: "40rem" }}
//                     ></div>
//                   )}
//                   <div className="h-3/5 p-6">
//                     <div className="h-full flex flex-col justify-between">
//                       <div>
//                         {/* contenteditable="true"  */}
//                         <h1 className="text-gray-900 dark:text-white font-bold text-2xl">
//                           {" "}
//                           {props.selectedPackage.name}
//                         </h1>
//                         <p className="mt-2 text-gray-600 dark:text-white text-sm">
//                           {props.selectedPackage.user
//                             ? props.selectedPackage.user.name
//                             : null}{" "}
//                           |{" "}
//                           <DayJS format="DD MMMM YYYY">
//                             {props.selectedPackage.updated_at}
//                           </DayJS>
//                         </p>
//                         <p className="mt-2 text-gray-600 dark:text-white text-sm">
//                           {" "}
//                           {props.selectedPackage.description}
//                         </p>
//                         <br />
//                         {files.length > 0 ? (
//                           <>
//                             <p className="mt-2 text-gray-600 dark:text-white text-sm font-bold">
//                               Files
//                             </p>
//                             {files.map((file) => (
//                               <p
//                                 key={file.path}
//                                 className="mt-2 text-gray-600 dark:text-white text-sm"
//                               >
//                                 {" "}
//                                 {file.name}
//                               </p>
//                             ))}
//                           </>
//                         ) : null}
//                       </div>
//                       <div className="flex item-center justify-between mt-3 self-end">
//                         {/* <h1 className="text-gray-700 font-bold text-xl">$220</h1> */}
//                         {/* <button className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded">Download</button> */}
//                         <button className="text-base flex-wrap bg-transparent hover:bg-blue-500 dark:text-white text-gray-900 font-semibold hover:text-white py-2 px-4 border border-gray-700 dark:border-white hover:border-transparent rounded"
//                         onClick={async ()=>{
//                           const packageNameUri = encodeURIComponent(props.selectedPackage.name);
//                           const res = await fetch(`/api/download-package?packageId=${props.selectedPackage.id}&packageName=${packageNameUri}`);
//                           let downloadUrlData;
//                           if (res) {
//                               downloadUrlData = await res.json();
//                           } else {
//                               toast(res, {
//                                   position: "bottom-right",
//                                   hideProgressBar: true,
//                                   closeOnClick: true,
//                                   pauseOnHover: false,
//                                   draggable: true,
//                                   progress: undefined,
//                               });
//                               return;
//                           }
//                           const a = document.createElement('a');
//                           a.href = downloadUrlData.fbxDownloadUrl;
//                           a.click();
//                           a.remove()
//                         }}>
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </OverlayScrollbarsComponent>
//             </div>
//           </div>
//         ) : null}
//       </Transition>
//     </div>
//   );
// }

export function PackageItem({ className, ...props }) {
  const [imgs, setImgs] = useState(null);

  const getImages = async () => {
    const imgs = [];
    const images = JSON.parse(props._package.images);
    if (images) {
      for (let index = 0; index < images.length; index++) {
        const img = props._package.id + images[index];
        imgs.push("https://d3evhy8mwh3ep4.cloudfront.net/" + img);
      }
      setImgs(imgs);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  return (
    <div
      tabIndex="0"
      className={`${className} flex flex-col pb-4 rounded-lg shadow-md h-60 bg-white dark:bg-gray-500 transition-transform duration-75 transform hover:scale-105 sm:motion-reduce:hover:animate-none`}
      {...props}
    >
      {imgs && imgs.length > 0 ? (
        <img
          src={imgs[0]}
          className="rounded-t-lg w-full object-cover object-top"
          style={{ height: "80%" }}
        ></img>
      ) : (
        <div
          className="rounded-t-lg w-full bg-gray-100 dark:bg-gray-400"
          style={{ height: "80%" }}
        ></div>
      )}
      <div className="px-4 dark:text-white" style={{ height: "20%" }}>
        <div className="text-md font-black mt-2">{props._package.name}</div>
        <div className="text-sm">{props._package.description}</div>
      </div>
    </div>
  );
}

export function LoadMoreSection(props) {
  return (
    <div className="mt-4 flex justify-center w-full pb-20">
      <div className="flex shadow-sm mx-4">
        <button
          className="relative inline-flex dark:text-white items-center px-4 py-2 rounded-l-md rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
          onClick={props.loadMore}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
