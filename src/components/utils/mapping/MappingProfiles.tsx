import { useState, useEffect } from "react";
import { Save, Trash2 } from "lucide-react";

interface MappingProfile {
  id: string;
  name: string;
  mapping: Record<string, string>;
  createdAt: string;
}

interface MappingProfilesProps {
  mapping: Record<string, string>;
  setMapping: (mapping: Record<string, string>) => void;
}

function MappingProfiles({ mapping, setMapping }: MappingProfilesProps) {
  const [savedProfiles, setSavedProfiles] = useState<MappingProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [profileName, setProfileName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  // Load profiles from local storage on mount
  useEffect(() => {
    const storedProfiles = localStorage.getItem("csvMappingProfiles");
    if (storedProfiles) {
      try {
        setSavedProfiles(JSON.parse(storedProfiles));
      } catch (error) {
        console.error("Error parsing stored profiles:", error);
      }
    }
  }, []);

  // Save mapping profile
  const saveProfile = () => {
    if (!profileName.trim()) return;

    const newProfile: MappingProfile = {
      id: Date.now().toString(),
      name: profileName,
      mapping,
      createdAt: new Date().toISOString(),
    };

    const updatedProfiles = [...savedProfiles, newProfile];
    setSavedProfiles(updatedProfiles);
    localStorage.setItem("csvMappingProfiles", JSON.stringify(updatedProfiles));
    setProfileName("");
    
    // Auto-select newly created profile
    setSelectedProfile(newProfile.id);
  };

  // Load profile
  const loadProfile = (profileId: string) => {
    const profile = savedProfiles.find((p) => p.id === profileId);
    if (profile) {
      setMapping(profile.mapping);
    }
  };

  // Delete profile
  const deleteProfile = (profileId: string) => {
    const updatedProfiles = savedProfiles.filter((p) => p.id !== profileId);
    setSavedProfiles(updatedProfiles);
    localStorage.setItem("csvMappingProfiles", JSON.stringify(updatedProfiles));
    
    if (selectedProfile === profileId) {
      setSelectedProfile("");
    }
    
    setShowConfirmDelete(null);
  };

  // Update profile with current mapping
  const updateProfile = (profileId: string) => {
    const updatedProfiles = savedProfiles.map(profile => 
      profile.id === profileId 
        ? { ...profile, mapping, createdAt: new Date().toISOString() }
        : profile
    );
    
    setSavedProfiles(updatedProfiles);
    localStorage.setItem("csvMappingProfiles", JSON.stringify(updatedProfiles));
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <h3 className="font-medium mb-3">Mapping Profiles</h3>
      
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        {/* Load Profile */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Load Saved Profile
          </label>
          <div className="flex gap-2">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedProfile}
              onChange={(e) => {
                setSelectedProfile(e.target.value);
                if (e.target.value) {
                  loadProfile(e.target.value);
                }
              }}
            >
              <option value="">Select a profile</option>
              {savedProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
            
            {selectedProfile && (
              <div className="flex">
                <button
                  className="px-3 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
                  onClick={() => updateProfile(selectedProfile)}
                  title="Update profile with current mapping"
                >
                  Update
                </button>
                <button
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors ml-1"
                  onClick={() => setShowConfirmDelete(selectedProfile)}
                  title="Delete profile"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            )}
          </div>
          
          {/* Delete Confirmation */}
          {showConfirmDelete && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700 mb-1">Are you sure you want to delete this profile?</p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-2 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => deleteProfile(showConfirmDelete)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Profile */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Save Current Mapping
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Profile name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
            <button
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
              onClick={saveProfile}
              disabled={!profileName.trim()}
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>
      
      {selectedProfile && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(savedProfiles.find(p => p.id === selectedProfile)?.createdAt || "").toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default MappingProfiles;