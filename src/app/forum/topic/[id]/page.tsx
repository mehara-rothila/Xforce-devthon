'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopicPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState('');
  const [hoveredReply, setHoveredReply] = useState<number | null>(null);
  
  // Category styling mapping
  const categoryStyles = {
    'Physics': {
      color: 'blue',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      hoverGradientFrom: 'from-blue-500',
      hoverGradientTo: 'to-blue-700',
      lightBg: 'bg-blue-50',
      accentColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      iconColor: 'text-blue-500',
      lightText: 'text-blue-400',
    },
    'Chemistry': {
      color: 'green',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      hoverGradientFrom: 'from-green-500',
      hoverGradientTo: 'to-green-700',
      lightBg: 'bg-green-50',
      accentColor: 'text-green-600',
      borderColor: 'border-green-200',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
      iconColor: 'text-green-500',
      lightText: 'text-green-400',
    },
    'Combined Mathematics': {
      color: 'yellow',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      hoverGradientFrom: 'from-yellow-500',
      hoverGradientTo: 'to-yellow-700',
      lightBg: 'bg-yellow-50',
      accentColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      lightText: 'text-yellow-400',
    },
    'General Discussion': {
      color: 'purple',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      hoverGradientFrom: 'from-purple-500',
      hoverGradientTo: 'to-purple-700',
      lightBg: 'bg-purple-50',
      accentColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      iconColor: 'text-purple-500',
      lightText: 'text-purple-400',
    }
  };

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
      level: 'Intermediate',
      joinedDate: 'Oct 2023',
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
          level: 'Expert',
          joinedDate: 'Apr 2022',
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
          level: 'Advanced',
          joinedDate: 'Jul 2023',
        },
        createdAt: '20 hours ago',
        bestAnswer: false,
        upvotes: 8,
        downvotes: 1,
      },
    ],
  };

  const styles = categoryStyles[topic.category as keyof typeof categoryStyles] || categoryStyles['General Discussion'];

  // Add a subtle parallax effect to the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pageBackground = document.getElementById('topic-page-background');
      if (pageBackground) {
        pageBackground.style.transform = `translateY(${scrollY * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reply submitted: ' + replyContent);
    setReplyContent('');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-${styles.color}-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      {/* Decorative background elements */}
      <div id="topic-page-background" className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className={`absolute top-20 left-1/4 w-64 h-64 bg-${styles.color}-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow`}></div>
        <div className={`absolute top-40 right-1/4 w-96 h-96 bg-${styles.color}-300 rounded-full filter blur-3xl opacity-20 animate-float`}></div>
        <div className={`absolute bottom-20 left-1/3 w-80 h-80 bg-${styles.color}-100 rounded-full filter blur-3xl opacity-30 animate-pulse-slow`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm font-medium bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-3 animate-fadeIn">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/forum" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                Forum
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href={`/forum/category/1`} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                {topic.category}
              </Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <span className={`${styles.accentColor} font-semibold`}>Topic</span>
            </li>
          </ol>
        </nav>
        
        {/* Topic Header */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className={`p-1 bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}></div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl">{topic.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles.badgeBg} ${styles.badgeText}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {topic.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {topic.views} views
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Posted {topic.createdAt}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {topic.replies.length} replies
              </span>
            </div>
          </div>
        </div>
        
        {/* Original Post */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="p-6">
            <div className="sm:flex">
              {/* Author sidebar */}
              <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
                <div className="flex flex-col items-center sm:w-32">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <span className="text-xl font-semibold">{topic.author.name.charAt(0)}</span>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-gray-900">{topic.author.name}</p>
                    <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {topic.author.level}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{topic.author.reputation} points</p>
                    <p className="text-xs text-gray-500">Joined {topic.author.joinedDate}</p>
                  </div>
                </div>
              </div>
              
              {/* Post content */}
              <div className="flex-1">
                <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-line">
                  {topic.content}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Posted {topic.createdAt}
                  </div>
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 rounded-md text-sm ${styles.lightBg} ${styles.accentColor} hover:bg-opacity-80 transition-colors duration-200 font-medium flex items-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <button className={`px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Bookmark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Replies */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Replies ({topic.replies.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {topic.replies.map((reply) => (
              <div 
                key={reply.id} 
                className={`p-6 transition-all duration-300 ${reply.bestAnswer ? 'bg-green-50 border-l-4 border-green-500' : hoveredReply === reply.id ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHoveredReply(reply.id)}
                onMouseLeave={() => setHoveredReply(null)}
              >
                <div className="sm:flex">
                  {/* Author sidebar */}
                  <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0">
                    <div className="flex flex-col items-center sm:w-32">
                      <div className={`w-16 h-16 rounded-full ${reply.bestAnswer ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'} flex items-center justify-center text-white shadow-md`}>
                        <span className="text-xl font-semibold">{reply.author.name.charAt(0)}</span>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-sm font-semibold text-gray-900">{reply.author.name}</p>
                        <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reply.author.level === 'Expert' ? 'bg-green-100 text-green-800' : reply.author.level === 'Advanced' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                          {reply.author.level}
                        </div>
                        <p className="mt-2 text-xs text-gray-500">{reply.author.reputation} points</p>
                        <p className="text-xs text-gray-500">Joined {reply.author.joinedDate}</p>
                      </div>
                      <div className="mt-4 flex flex-col space-y-3">
                        <button className={`group w-full px-2 py-1 rounded-md text-sm ${hoveredReply === reply.id ? styles.lightBg : 'bg-gray-100'} ${hoveredReply === reply.id ? styles.accentColor : 'text-gray-600'} transition-colors duration-200 font-medium flex items-center justify-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 transition-colors duration-200 ${hoveredReply === reply.id ? styles.accentColor : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>{reply.upvotes}</span>
                        </button>
                        <button className="w-full px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span>{reply.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reply content */}
                  <div className="flex-1">
                    {reply.bestAnswer && (
                      <div className="mb-3 flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Best Answer
                        </span>
                      </div>
                    )}
                    <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-line">
                      {reply.content}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Posted {reply.createdAt}
                      </div>
                      <div className="flex space-x-2">
                        <button className={`px-3 py-1 rounded-md text-sm ${styles.lightBg} ${styles.accentColor} hover:bg-opacity-80 transition-colors duration-200 font-medium flex items-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Reply
                        </button>
                        <button className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                          More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reply Form */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Post a Reply
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleReplySubmit}>
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                    <span className="text-sm font-semibold text-purple-700">Y</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">You</span>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm">
                    <button type="button" className="p-1 mr-1 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button type="button" className="p-1 mr-1 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    id="reply"
                    name="reply"
                    rows={6}
                    className="w-full p-4 bg-white border-0 focus:outline-none focus:ring-0"
                    placeholder="Write your reply here... You can use **bold** or *italic* for formatting."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Make sure your reply adds value to the discussion and follows our </span>
                  <Link href="/forum/guidelines" className={`${styles.accentColor} hover:underline`}>community guidelines</Link>.
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Similar Topics */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-2xl animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Similar Topics
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {[
                "Understanding magnetic flux density and its applications",
                "How to solve electromagnetism numerical problems effectively?",
                "Electromagnetic waves explained - from radio to gamma",
                "Maxwell's equations and their physical interpretations"
              ].map((topic, index) => (
                <li key={index} className="group">
                  <Link 
                    href={`/forum/topic/${index + 2}`} 
                    className={`flex items-center py-2 px-3 rounded-lg hover:${styles.lightBg} transition-colors duration-200`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-3 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className={`text-gray-800 group-hover:${styles.accentColor} transition-colors duration-200 font-medium`}>
                      {topic}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Link 
                href="/forum/search?q=electromagnetic+induction" 
                className={`inline-flex items-center ${styles.accentColor} font-medium hover:underline transition-colors duration-200 group`}
              >
                <span>Find more related topics</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Action Bar */}
        <div className="fixed bottom-6 right-6 z-20">
          <div className="flex flex-col items-end space-y-3">
            <button className={`w-12 h-12 rounded-full bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )}