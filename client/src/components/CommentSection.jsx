import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';


export default function CommentSection({postId}) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {

        if (comment.length > 200) {
            return;
        }

        const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: comment, postId, userId: currentUser._id }), 
        });

        const data = await res.json();

        if (res.ok) {
            setComment('');
            setCommentError(null);
        }
    } catch (error) {
        setCommentError(error.message);
    }};

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentUser ? (
            <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                <p>Signed in as:</p>
                <img 
                    src={currentUser.profilePicture} 
                    alt='Profile Picture' 
                    className='h-5 w-5 object-cover rounded-full'
                />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                    @{currentUser.username}
                </Link>
            </div>
        ) : (
            <div className='text-sm text-teal-500 my-5 flex gap-1'>
                You must be signed in to comment.
                <Link to={'/sign-in'} className='text-blue-500'>
                    Sign In
                </Link>
            </div>
        )} 

        {/* text section */}

        {currentUser && (
            <form 
                className='border border-teal-500 rounded-md p-3'
                onSubmit={handleSubmit}
            > 
                <Textarea 
                    placeholder='Add a comment...'
                    rows='3'
                    maxLength='200'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                />
                <div className='flex justify-between items-center mt-5'>
                    <p className='text-gray-500 text-sm'>{200 - comment.length} characters remaining</p>
                    <Button 
                        outline
                        gradientDuoTone='purpleToBlue'
                        type='submit'
                    >Submit</Button>

                </div>
                {/* commet error alert */}
                {
                    commentError && (
                        <Alert color='failure' className='mt-5'>{commentError}</Alert>
                    )
                }
            </form>          
        )}
    </div>
  )
}

