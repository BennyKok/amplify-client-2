import React, { useEffect, useState } from "react";

// import HorizontalHeader from "./HorizontalHeader.js";
import { PackagePopup, PackageItem, PackageLoadingIndicator, LoadMoreSection } from "./PackageComponent.js";
import { GetPackage, LoadMorePackages } from '../Store'

export default function HomePage() {
    const [packages, setPackages] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        if (selectedPackage) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [selectedPackage]);

    useEffect(() => {
        if (!packages)
            GetPackage(setPackages, 0);
    }, []);

    return (
        <div className="h-full">
            {/* <HorizontalHeader title="Explore all packages" /> */}
            <div className={"h-full mt-4 container mx-auto px-4 flex justify-center"}>
                {packages && packages.length >= 0 ? (
                    <div
                        className={
                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full pb-10"
                        }
                    >
                        {packages.map((_package, index) => (
                            <PackageItem
                                _package={_package}
                                key={_package.id}
                                onClick={() => {
                                    // setSelectedPackage(_package);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <PackageLoadingIndicator />
                )}
            </div>

            <LoadMoreSection loadMore={() => {
                LoadMorePackages(setPackages, packages)
            }} />

            {/* <div className="fixed z-10">
                <PackagePopup
                    selectedPackage={selectedPackage}
                    onCancel={() => {
                        setSelectedPackage(null);
                    }}
                />
            </div> */}
        </div >
    );
}
