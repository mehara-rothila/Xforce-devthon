'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TopicPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState('');
  
  // Mock topic data
  const topic = {
    id: parseInt(params.id),
    title: 'Need help understanding electromagnetic induction',
    content: `I'm struggling to understand the concept of electromagnetic induction, especially Faraday's Law and how it relates to Lenz's Law.

Can someone please explain the relationship between the changing magnetic flux and the induced EMF? 

Also, I'm having trouble with the right-hand rule. When do we use it for this concept?

Thanks in advance for any help!`,
    category: 'Physics',
    author: {
      name: 'Dinuka P.',
      image: '/profile-placeholder.jpg',
      reputation: 450,
    },
    createdAt: '2 days ago',
    views: 238,
    replies: [
      {
        id: 1,
        content: `Electromagnetic induction is the process where a conductor placed in a changing magnetic field causes the production of a voltage across the conductor.

**Faraday's Law**: The induced EMF in a closed circuit is equal to the negative of the rate of change of magnetic flux through the circuit.

Mathematically: EMF = -dΦ/dt

Where:
- EMF is the electromotive force (voltage)
- Φ is the magnetic flux
- The negative sign indicates the direction (Lenz's Law)

**Lenz's Law** complements Faraday's Law by specifying the direction of the induced current. It states that the induced current flows in the direction that opposes the change in flux that produced it.

As for the right-hand rule, for electromagnetic induction, we use it to determine the direction of the induced current or EMF. Point your thumb in the direction of the magnetic field and your fingers will curl in the direction of the induced current.

Hope this helps! Let me know if you need more clarification.`,
        author: {
          name: 'Samith R.',
          image: '/profile-placeholder.jpg',
          reputation: 1250,
        },
        createdAt: '1 day ago',
        bestAnswer: true,
        upvotes: 15,
        downvotes: 0,
      },
      {
        id: 2,
        content: `I found this diagram really helpful when understanding electromagnetic induction:

[Image of electromagnetic induction diagram]

Basically, whenever there's relative motion between a conductor and a magnetic field, an EMF is induced.

Remember that the magnetic flux Φ = B·A·cosθ, where:
- B is the magnetic field strength
- A is the area of the loop
- θ is the angle between B and the normal to the loop

So flux can change if B changes, A changes, or θ changes.`,
        author: {
          name: 'Kavisha M.',
          image: '/profile-placeholder.jpg',
          reputation: 820,
        },
        createdAt: '20 hours ago',
        bestAnswer: false,
        upvotes: 8,
        downvotes: 1,
      },
    ],
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reply submitted: ' + replyContent);
    setReplyContent('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/forum" className="text-gray-500 hover:text-gray-700">
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href={`/forum/category/1`} className="text-gray-500 hover:text-gray-700">
                {topic.category}
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900">Topic</span>
            </li>
          </ol>
        </nav>
        
        {/* Topic Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{topic.title}</h1>
            <div className="flex items-center text-sm">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                topic.category === 'Physics' ? 'bg-blue-100 text-blue-800' :
                topic.category === 'Chemistry' ? 'bg-green-100 text-green-800' :
                topic.category === 'Combined Mathematics' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {topic.category}
              </span>
              <span className="ml-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {topic.views} views
              </span>
              <span className="ml-4 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {topic.createdAt}
              </span>
            </div>
          </div>
        </div>
        
        {/* Original Post */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex">
              <div className="flex-shrink-0 mr-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-purple-700">{topic.author.name.charAt(0)}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{topic.author.name}</p>
                    <p className="text-xs text-gray-500">{topic.author.reputation} points</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {topic.content}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Replies */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Replies ({topic.replies.length})</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topic.replies.map((reply) => (
              <div key={reply.id} className={`p-6 ${reply.bestAnswer ? 'bg-green-50' : ''}`}>
                <div className="flex">
                  <div className="flex-shrink-0 mr-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-lg font-semibold text-purple-700">{reply.author.name.charAt(0)}</span>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium text-gray-900">{reply.author.name}</p>
                        <p className="text-xs text-gray-500">{reply.author.reputation} points</p>
                      </div>
                      <div className="mt-4 flex flex-col space-y-2">
                      <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>{reply.upvotes}</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>{reply.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                      {reply.content}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Posted {reply.createdAt}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          Reply
                        </button>
                        {reply.bestAnswer && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Best Answer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reply Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Post a Reply</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <textarea
                  id="reply"
                  name="reply"
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Write your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                >
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Similar Topics */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Similar Topics</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li>
                <Link href="/forum/topic/2" className="text-purple-600 hover:text-purple-800 font-medium">
                  Understanding magnetic flux density and its applications
                </Link>
              </li>
              <li>
                <Link href="/forum/topic/3" className="text-purple-600 hover:text-purple-800 font-medium">
                  How to solve electromagnetism numerical problems effectively?
                </Link>
              </li>
              <li>
                <Link href="/forum/topic/4" className="text-purple-600 hover:text-purple-800 font-medium">
                  Electromagnetic waves explained - from radio to gamma
                </Link>
              </li>
              <li>
                <Link href="/forum/topic/5" className="text-purple-600 hover:text-purple-800 font-medium">
                  Maxwell's equations and their physical interpretations
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}