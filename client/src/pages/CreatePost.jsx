import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import 'quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import QuillEditor from '../components/QuillEditor.jsx';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Define constants for image validation
const MAX_FILE_SIZE_MB = 5; // Maximum file size in MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const DEFAULT_VALUES = {
  category: 'uncategorized',
  image: 'https://miro.medium.com/v2/resize:fit:1024/1*yBt65HhmARbqZDDJ1McFDg.png'
};

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: DEFAULT_VALUES.category,
    content: '',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

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

  // Memoize the handleFormChange function
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImageUploadProgress(null); // Clear progress
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
          setImageUploadProgress(null); // Clear progress on error

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
            handleFormChange('image', downloadURL);
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed: ' + error.message);
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // handle submit the post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

       // Create a new object with default values where necessary
       const submissionData = {
        ...formData,
        // Only include image if user uploaded one, otherwise backend will use default
        image: formData.image || undefined,
        // Only include category if user selected one different from default
        category: formData.category === DEFAULT_VALUES.category ? undefined : formData.category
      };

      const res = await fetch('/api/post/create', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      } 
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  }

  // Preview image - shows uploaded image or default if none uploaded
  const previewImage = formData.image || DEFAULT_VALUES.image;

  return (
    <div className="p-3 max-w-3xl mx-auto in-h-sceen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form 
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput 
            type="text" 
            placeholder="Title" 
            required 
            id="title" 
            className="flex-1" 
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)
            }
          />

          <Select
            value={formData.category}
            onChange={(e) => handleFormChange('category', e.target.value)
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                Maximum file size: {MAX_FILE_SIZE_MB}MB. Supported formats: {ALLOWED_FILE_TYPES.map(type => type.split('/')[1]).join(', ')}
              </p>
              {!formData.image && (
                <p className="text-sm text-gray-500 italic">
                  (Default image will be used if none uploaded)
                </p>
              )}
            </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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

        {/* Show either uploaded image or default image */}
        <div className="relative">
          <img
            src={previewImage}
            alt={formData.image ? "Uploaded" : "Default"}
            className="w-full h-72 object-cover"
          />
          {!formData.image && (
            <div className="absolute top-2 right-2">
              <span className="bg-gray-900 text-white px-2 py-1 rounded-md text-sm opacity-75">
                Default Image
              </span>
            </div>
          )}
        </div>

        {/* Quill editor container */}
        <QuillEditor
          value={formData.content}
          onChange={(content) => handleFormChange('content', content)}
        />


        <Button type="submit" gradientDuoTone="purpleToPink">Publish</Button>

        {
          publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>
        }
      </form>
    </div>
  );
}
