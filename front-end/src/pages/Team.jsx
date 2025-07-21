import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Frans Gabriel Hutauruk',
      nim: '2257301050',
      email: 'frans22si@mahasiswa.pcr.ac.id',
      photo: 'frans.png',
      role: 'Data Scientist & Full Stack Developer'
    },
    {
      id: 2,
      name: 'Wan Muhammad Rafi Risqullah',
      nim: '2257301133',
      email: 'wan22si@mahasiswa.pcr.ac.id',
      photo: 'rafi.png',
      role: 'Data Scientist & Analyst System'
    }
  ];

  return (
    <div className="min-h-[92vh] bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col justify-center p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col justify-center h-full">
        {/* Header Section */}
        <div className="text-center mb-6 flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
            Tentang Tim
          </h1>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto flex-1 items-center pb-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-fit">
              {/* Profile Card */}
              <div className="p-6 text-center">
                {/* Photo */}
                <div className="mb-4">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto border-4 border-blue-100 shadow-lg object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                
                {/* Role */}
                <p className="text-sm md:text-md text-purple-600 font-medium mb-3">{member.role}</p>
                
                {/* NIM */}
                <p className="text-md md:text-lg text-blue-600 font-semibold mb-4">NIM: {member.nim}</p>

                {/* Email */}
                <div className="flex items-center justify-center space-x-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  <a 
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm transition-colors duration-200"
                  >
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;