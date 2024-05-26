import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from '@remix-run/react';
import { SupabaseOutletContext } from '~/root';

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

interface SocialItem {
  icon: string;
  url: string;
  color: string;
  background_color: string;
}

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [filteredContributors, setFilteredContributors] = useState<SocialItem[]>([]);
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/orangopus/ollo/contributors');
        setContributors(response.data);
      } catch (error) {
        console.error('Error fetching GitHub contributors:', error);
      }
    };
    fetchContributors();
  }, []);

  useEffect(() => {
    const fetchSocialsForContributors = async () => {
        try {
          const socialArray = contributors.map((contributor) => contributor.html_url);
            
          const contributorsWithSocials = await Promise.all(
            socialArray.map(async (socialUrl) => {
            const StringReplace = socialUrl.replaceAll('"', '');

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('social')
                .containedBy('social.url', [StringReplace]); // Use socialUrl directly
      
              if (profileError) {
                console.error(`Error fetching profile for ${socialUrl}:`, profileError);
                return null;
              }
      
              return profileData.length > 0 ? { url: socialUrl, ...profileData[0].social } : null;
            })
          );
      
          const filteredContributors = contributorsWithSocials.filter((contributor) => contributor !== null) as SocialItem[];
          setFilteredContributors(filteredContributors);
        } catch (error) {
          console.error('Error in fetchSocialsForContributors:', error);
        }
      };

      fetchSocialsForContributors();
      
      
  }, [contributors, supabase]);

  return (
    <div>
      <ul className="flex flex-col">
        {filteredContributors.length > 0 ? (
          filteredContributors.map((contributor) => (
            <li key={contributor.url} className="flex items-center mb-2">
              <img src={contributor.icon} alt={contributor.url} className="w-8 h-8 rounded-full" />
              <a href={contributor.url} className="ml-2" style={{ color: contributor.color }}>
                {contributor.url}
              </a>
            </li>
          ))
        ) : (
          <li>No contributors found</li>
        )}
      </ul>
    </div>
  );
};

export default Contributors;
