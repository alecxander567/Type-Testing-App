import Navbar from "./component/Navbar";
import { User, Zap, Target, BarChart, Edit2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

// Profile Interface
interface ProfileStats {
  username: string;
  bio?: string;
  profile_image?: string;
  best_wpm: number;
  best_accuracy: number;
  preferred_difficulty: string;
}

function Profile() {
  // States
  const [profile, setProfile] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Profile Stats
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const { data: info } = await axios.get<{
          username: string;
          bio?: string;
          profile_image?: string;
        }>(`http://localhost:8000/api/profile/?username=${username}`);

        const { data: stats } = await axios.get<{
          best_wpm: number;
          best_accuracy: number;
          preferred_difficulty: string;
        }>(`http://localhost:8000/api/profile/stats/?username=${username}`);

        setProfile({ ...info, ...stats });
        setBio(info.bio || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Profile Update handler
  const handleProfileUpdate = async (file?: File) => {
    if (!profile) return;

    const formData = new FormData();
    if (file) formData.append("profile_image", file);
    formData.append("bio", bio);

    try {
      const { data } = await axios.put<{
        username: string;
        bio?: string;
        profile_image?: string;
      }>(
        `http://localhost:8000/api/profile/?username=${profile.username}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setProfile({ ...profile, ...data });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden text-blue-100 bg-gradient-to-br from-blue-950 via-indigo-950 to-black">
      <Navbar />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Zap className="absolute top-20 left-20 w-20 h-20 text-blue-500/10 animate-float-slow" />
        <Target className="absolute top-1/3 right-24 w-24 h-24 text-indigo-500/10 animate-float" />
        <BarChart className="absolute bottom-24 left-1/4 w-28 h-28 text-cyan-500/10 animate-float-reverse" />
        <Zap className="absolute bottom-10 right-1/3 w-16 h-16 text-blue-400/10 animate-float-slow" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="relative z-10 w-full max-w-5xl bg-zinc-900/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-10 shadow-2xl">
          <div className="relative flex flex-col items-center text-center mb-12">
            <label className="relative cursor-pointer group">
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden mb-4 border-4 border-blue-500">
                {profile?.profile_image ? (
                  <img
                    src={`http://localhost:8000${profile.profile_image}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-blue-400" />
                )}
              </div>

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
                <span className="text-sm text-white">Change</span>
              </div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files) handleProfileUpdate(e.target.files[0]);
                }}
              />
            </label>

            <h1 className="text-3xl font-bold">
              {loading ? "Loading..." : profile?.username}
            </h1>

            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-4 w-full max-w-md bg-zinc-800/70 text-white text-lg rounded-lg p-3 resize-none focus:outline-none border border-blue-500/20"
                rows={3}
              />
            ) : (
              <p className="mt-4 text-white text-lg max-w-md">
                {profile?.bio || "No bio yet."}
              </p>
            )}

            <div className="mt-4 flex justify-center w-full">
              <button
                onClick={async () => {
                  if (isEditing) {
                    await handleProfileUpdate();
                  }
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white border border-blue-500 hover:bg-blue-600 hover:text-white transition z-20 text-lg font-semibold">
                {isEditing ? (
                  <>
                    <Save className="w-5 h-5" /> Save Update
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-800/70 rounded-2xl p-6 border border-blue-500/20 flex items-center gap-5">
              <Zap className="text-blue-400 w-10 h-10" />
              <div>
                <p className="text-blue-300/70 text-sm uppercase tracking-wide">
                  Best WPM
                </p>
                <p className="text-3xl font-extrabold">
                  {loading ? "--" : profile?.best_wpm}
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/70 rounded-2xl p-6 border border-blue-500/20 flex items-center gap-5">
              <Target className="text-blue-400 w-10 h-10" />
              <div>
                <p className="text-blue-300/70 text-sm uppercase tracking-wide">
                  Best Accuracy
                </p>
                <p className="text-3xl font-extrabold">
                  {loading ? "--" : `${profile?.best_accuracy}%`}
                </p>
              </div>
            </div>

            <div className="bg-zinc-800/70 rounded-2xl p-6 border border-blue-500/20 flex items-center gap-5">
              <BarChart className="text-blue-400 w-10 h-10" />
              <div>
                <p className="text-blue-300/70 text-sm uppercase tracking-wide">
                  Preferred Difficulty
                </p>
                <p className="text-3xl font-extrabold">
                  {loading ? "--" : profile?.preferred_difficulty}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
