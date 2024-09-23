import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import "./Photo.css"

function Photo({poi, setPoi}) {
    const [file, setFile] = useState();
    const [uploadName, setUploadName] = useState()
    const [isRejected, setIsRejected] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState()
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setUploadName(null)
        setPoi(null)

        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(URL.createObjectURL(acceptedFiles[0]));
            const formData = new FormData();
            formData.append('file', acceptedFiles[0]);
            const options = {
                method: 'POST',
                body: formData
            }
            fetch('http://localhost:3001/img/upload', options)
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    setUploadName(json.filename)
                })
        }
        setIsRejected(rejectedFiles && rejectedFiles.length > 0)
        if(isRejected) {
            setUploadName(null)
        }
    }, [])
    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop, accept: {
            "image/*": [".png", '.jpg', ".jpeg", ".webp"]
        }
    })

    useEffect(() => {
        if(uploadName) {
            setError(null)
            setIsProcessing(true)
            fetch('http://localhost:3001/get-poi-name?' + new URLSearchParams({ filename: uploadName }))
                .then(res => {
                    console.log(res)
                    if (!res.ok) {
                        setIsProcessing(false)
                        setPoi(null)
                        setError("Error occured while recognization, please try again")
                        return
                    }
                    return res.json()
                })
                .then(json => {
                    // console.log(json)
                    if (json) {
                        setIsProcessing(false)
                        try {
                            const obj = typeof(json) === "string"? JSON.parse(json): json
                            if ('locationName' in obj && 'country' in obj) {
                                setPoi(obj)
                            } else {
                                setPoi(null)
                            }
                        } catch (error) {
                            console.error(error)
                            setPoi(null)
                            // setError(error?.message)
                        }
                    }
                })
        }
    }, [uploadName])

    return (
        <div id="photo" {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (<p>All files will be accepted</p>)}
            {isDragReject && (<p>Some files will be rejected</p>)}
            {!isDragActive && (<p>Drop some files here ...</p>)}
            {isRejected ? <p>Dropped file has been rejected</p> : (<img src={file} id="img" />)}
            {isProcessing && <p>Processing</p>}
            {poi && <p>{`${poi.locationName}, ${poi.country}`}</p>}
            {error && <p>{`${error}`}</p>}
        </div>
    )
}

export default Photo