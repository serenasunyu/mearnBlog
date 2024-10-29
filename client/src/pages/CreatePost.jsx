import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import 'quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';

// Define constants for image validation
const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];


export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const editorRef = useRef(null); // Reference for Quill container
  const [editorContent, setEditorContent] = useState(''); // State for editor content

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, { 
        theme: 'snow',
        placeholder: 'Write something...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      quill.on('text-change', () => {
        setEditorContent(quill.root.innerHTML);
      });
    }
  }, []);

  const validateFile = (file) => {
    if (!file) return 'Please select an image';
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload ${ALLOWED_FILE_TYPES.map(type => type.split('/')[1]).join(', ')} files only.`;
    }
    
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }
    
    return null;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Clear previous errors
    setImageUploadError(null);
    
    // Validate file immediately on selection
    const error = validateFile(selectedFile);
    if (error) {
      setImageUploadError(error);
      setFile(null); // Clear the invalid file
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleUploadImage = async () => {
    try {
      // Validate file again before upload
      const error = validateFile(file);
      if (error) {
        setImageUploadError(error);
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload Progress:', progress); // Check upload progress
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error('Upload Error:', error); // Log any errors

          let errorMessage = 'Image upload failed';
          
          // Handle specific Firebase storage errors
          switch (error.code) {
            case 'storage/unauthorized':
              errorMessage = 'Permission denied. Please check your authentication.';
              break;
            case 'storage/quota-exceeded':
              errorMessage = 'Storage quota exceeded. Please contact support.';
              break;
            case 'storage/invalid-checksum':
              errorMessage = 'File corrupted during upload. Please try again.';
              break;
            case 'storage/retry-limit-exceeded':
              errorMessage = 'Upload failed due to poor connection. Please try again.';
              break;
            default:
              errorMessage = `Upload failed: ${error.message}`;
          }
          setImageUploadError(errorMessage);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('Download URL:', downloadURL); // Log download URL
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed: ' + error.message);
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto in-h-sceen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">
              Maximum file size: {MAX_FILE_SIZE_MB}MB. Supported formats: {ALLOWED_FILE_TYPES.map(type => type.split('/')[1]).join(', ')}
          </p>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={imageUploadProgress !== null}
            >
              {imageUploadProgress !== null ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar 
                    value={imageUploadProgress} 
                    text={`${imageUploadProgress || 0}%`} 
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
        </div>

        {/* Upload image error */}
        {imageUploadError && <Alert color="failure" className='mt-2'>{imageUploadError}</Alert>}

        {/* Display uploaded image */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}

        {/* Quill editor container */}
        <div ref={editorRef} className="h-72 mb-12" />

        <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>
      </form>
    </div>
  );
}
