import { useOutletContext } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { SupabaseOutletContext } from "~/root";

interface SocialItem {
  icon: string;
  url: string;
  color: string;
  background_color: string;
}

const EditSocialItem: React.FC = () => {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndSocials = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }
  
      setUser(userData.user);
      console.log(userData.user?.id);
  
      if (userData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('social')
          .eq('id', userData.user.id)
          .single();
  
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          if (profileData && Array.isArray(profileData.social)) {
            setSocials(profileData.social);
          } else {
            setSocials([]);
          }
          console.log("Fetched socials:", profileData?.social);
        }
      }
    };
  
    fetchUserAndSocials();
  }, [supabase]);

  const handleSocialChange = (index: number, field: keyof SocialItem, value: string) => {
    const newSocials = [...socials];
    newSocials[index][field] = value;
    setSocials(newSocials);
  };

  const addSocial = () => {
    setSocials([...socials, { icon: "", url: "", color: "#ffffff", background_color: "#000000" }]);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const updateProfile = async () => {
    if (!user) {
      console.log("No user is logged in");
      return;
    }

    console.log("Updating profile for user ID:", user.id);
    console.log("Social items to update:", socials);

    const { data, error } = await supabase
      .from('profiles')
      .update({ social: socials })
      .eq('id', user.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      console.log("Profile updated:", data);
    }
  };

  return (
    <div className="bg-gray-900 text-white center socialcontainer p-6 rounded-lg shadow-lg">
      {socials?.map((social, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor={`icon-${index}`}>
              FontAwesome Social Icon
            </label>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white"
              id={`icon-${index}`}
              type="text"
              value={social.icon}
              onChange={(e) => handleSocialChange(index, "icon", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor={`url-${index}`}>
              URL
            </label>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white"
              id={`url-${index}`}
              type="text"
              value={social.url}
              onChange={(e) => handleSocialChange(index, "url", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor={`iconColor-${index}`}>
              Icon Colour
            </label>
            <div className="flex items-center">
              <input
                className="w-full p-2 rounded bg-gray-800 text-white"
                id={`iconColor-${index}`}
                type="text"
                value={social.color}
                onChange={(e) => handleSocialChange(index, "color", e.target.value)}
              />
              <input
                className="w-12 h-12 p-1 ml-2 rounded bg-gray-800 text-white"
                id={`iconColorPicker-${index}`}
                type="color"
                value={social.color}
                onChange={(e) => handleSocialChange(index, "color", e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor={`backgroundColor-${index}`}>
              Background Colour
            </label>
            <div className="flex items-center">
              <input
                className="w-full p-2 rounded bg-gray-800 text-white"
                id={`backgroundColor-${index}`}
                type="text"
                value={social.background_color}
                onChange={(e) => handleSocialChange(index, "background_color", e.target.value)}
              />
              <input
                className="w-12 h-12 p-1 ml-2 rounded bg-gray-800 text-white"
                id={`backgroundColorPicker-${index}`}
                type="color"
                value={social.background_color}
                onChange={(e) => handleSocialChange(index, "background_color", e.target.value)}
              />
            </div>
          </div>
          <button
            className="bg-red-500 p-2 text-white button"
            onClick={() => removeSocial(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button className="bg-green-500 p-2 button mr-5 text-white mb-4" onClick={addSocial}>
        Add Social
      </button>
      <button className="bg-blue-500 p-2 button text-white" onClick={updateProfile}>
        Update
      </button>
    </div>
  );
};

export default EditSocialItem;
