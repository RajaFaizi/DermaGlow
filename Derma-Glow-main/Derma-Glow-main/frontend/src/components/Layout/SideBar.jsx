import React, { useEffect, useState } from 'react';
import { MessageCircle, Settings, User, Edit, Trash2, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";

import { setSessions, removeSession } from '../../store/sessionSlice'; // Import the setSessions action

const SideBar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessions = useSelector( ( state ) => state.sessions ); // Access sessions from Redux store





    const handleSessionClick = ( session ) => {
        navigate( `/chat/${session.id}`, {
            state: {
                sessionId: session.id,
                isNewSession: false
            }
        } );
    };


    useEffect( () => {
        const fetchSessions = async () => {
            const token = localStorage.getItem( 'token' );
            try {
                const response = await axios.get( 'http://localhost:8000/api/session/user-sessions', {
                    headers: { Authorization: `Bearer ${token}` }
                } );

                console.log( "Reponse coming", response )
                // Dispatch action to set sessions in Redux store
                dispatch( setSessions( response.data.data ) );
            } catch ( error ) {
                console.error( 'Error fetching sessions:', error );
            }
        };

        fetchSessions();
    }, [ dispatch ] );


   
    // Check if user is authenticated
    const token = localStorage.getItem( 'token' );
    const isAuthenticated = Boolean( token ); // Convert to boolean for clarity

  

    const settingsItems = [
        {
            icon: User,
            name: 'Profile',
            path: '/profile',
        },
        {
            icon: Settings,
            name: 'Settings',
            path: '/settings',
        }
    ];

    const NavItem = ( { icon: Icon, name, path } ) => {
        const isActive = location.pathname === path;
        return (
            <Link
                to={path}
                className={`flex items-center px-4 py-3 rounded-lg mb-1.5 transition-colors duration-200
                    ${isActive ? 'bg-[#A2AA7B] text-white' : 'text-[#5C6748] hover:bg-[#D7E0BD]/20'}`}
            >
                <Icon size={20} className="mr-2" />
                <span className="text-base font-medium">{name}</span>
            </Link>
        );
    };


    console.log( "new session", sessions )



    const handleDeleteSession = async ( sessionId ) => {
        const token = localStorage.getItem( 'token' );
        try {
            await axios.delete( `http://localhost:8000/api/session/${sessionId}`, {
                headers: { Authorization: `Bearer ${token}` }
            } );
            // Dispatch action to remove session from Redux store
            dispatch( removeSession( sessionId ) );


            if ( sessions.length > 1 ) {
                // If there are more sessions, navigate to the most recent session or the last active session
                const mostRecentSession = sessions.filter( session => session.id !== sessionId ).reduce( ( latest, session ) => {
                    return new Date( session.createdAt ) > new Date( latest.createdAt ) ? session : latest;
                } );
                navigate( `/chat/${mostRecentSession.id}` );
            } else {
                // If no sessions left, navigate to /assessment page
                navigate( '/assessment' );
            }


            navigate( "/assessment" )
        } catch ( error ) {
            console.error( 'Error deleting session:', error );
        }
    };


    return (
        <aside className="relative flex flex-col h-screen w-25 bg-white shadow-lg border-r border-[#E7EAE5]">
            <div className="flex flex-col h-full p-4">
                {/* Logo Section */}
                <Link to="/home" className="flex items-center justify-center py-4 mb-2" >
                    <img
                        src="/src/assets/logo2.png"
                        alt="Derma Glow Logo"
                        className="h-12 object-contain"
                    />
                </Link>

                {/* Chat Section */}
                <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-sage-200 scrollbar-track-transparent">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-base font-semibold text-sage-700">Chat</h2>
                        <Link 
                            to="/assessment"
                            className="p-2 hover:bg-sage-100 rounded-lg transition-colors duration-200"
                        >
                            <Edit size={20} className="text-sage-600" />
                        </Link>
                    </div>

                    {/* Sessions List */}
                    <div className="space-y-2 px-2">
                        {sessions.length > 0 ? (
                            sessions.map((session) => {
                                const isSessionActive = location.pathname === `/chat/${session.id}`;
                                const sessionName = `Session - ${new Date(session.createdAt).toLocaleDateString()}`;

                                return (
                                    <div
                                        key={session.id}
                                        className="group relative flex items-center justify-between rounded-lg transition-all duration-200 hover:bg-sage-50 cursor-pointer"
                                    >
                                        <div
                                            onClick={() => handleSessionClick(session)}
                                            className={`flex items-center flex-1 p-3 rounded-lg transition-all duration-200
                                                  ${isSessionActive ? 'bg-[#A2AA7B] text-white' : 'hover:bg-[#D7E0BD]/10'}`}
                                        >
                                            <MessageCircle 
                                                size={18} 
                                                className={`mr-3 ${isSessionActive ? 'text-white' : 'text-sage-500'}`} 
                                            />
                                            <span className="text-sm font-medium truncate">
                                                {sessionName}
                                            </span>
                                        </div>

                                        <button
                                            onClick={( e ) => {
                                                e.stopPropagation(); // Prevent triggering session click when deleting
                                                handleDeleteSession( session.id );
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                            aria-label="Delete session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 px-4 rounded-lg bg-sage-50">
                                <p className="text-sm text-sage-600 mb-2">
                                    No sessions available
                                </p>
                                <Link 
                                    to="/assessment"
                                    className="inline-flex items-center justify-center px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors duration-200"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Create Assessment
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Explore Clinics Link */}
                <div className="mt-4 px-2">
                    <Link
                        to="/explore-clinics"
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                            ${location.pathname === '/explore-clinics' ? 'bg-[#A2AA7B] text-white' : 'text-[#5C6748] hover:bg-[#D7E0BD]/20'}`}
                    >
                        <Building2 size={20} className="mr-2" />
                        <span className="text-base font-medium">Explore Clinics</span>
                    </Link>
                </div>

                {/* Settings Section */}
                {isAuthenticated && (
                    <div className="mt-auto pt-4 border-t border-sage-200">
                        <h2 className="text-sm font-semibold text-sage-700 mb-3 px-2">
                            ACCOUNT
                        </h2>
                        <div className="space-y-1">
                            {settingsItems.map((item, index) => (
                                <NavItem key={index} {...item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default SideBar;
