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

interface Profile {
  id: number;
  username: string;
  avatar: string;
  color: string;
  background_color: string;
}

interface SocialItem {
  icon: string;
  url: string;
  color: string;
  avatar: string;
  background_color: string;
}

const Contributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredContributors, setFilteredContributors] = useState<SocialItem[]>([]);
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/orangopus/ollo/contributors');
        setContributors(response.data);
        console.log('Fetched contributors:', response.data); // Log GitHub contributors
      } catch (error) {
        console.error('Error fetching GitHub contributors:', error);
      }
    };
    fetchContributors();
  }, []);

  useEffect(() => {
    const fetchSocialsAndProfiles = async () => {
      try {
        const { data: socialsData, error: socialsError } = await supabase
          .from('socials')
          .select('*');

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (socialsError) {
          console.error('Error fetching social data:', socialsError);
          return;
        }

        if (profilesError) {
          console.error('Error fetching profiles data:', profilesError);
          return;
        }

        console.log('All social data:', socialsData); // Log all social data
        console.log('All profiles data:', profilesData); // Log all profiles data

        const contributorsWithSocials: SocialItem[] = [];

        for (const contributor of contributors) {
          const matchingSocial = socialsData.find(social => {
            // Normalize URLs by removing trailing slashes and converting to lowercase
            const normalizedSocialUrl = social.url.replace(/\/+$/, '').toLowerCase();
            const normalizedContributorUrl = contributor.html_url.replace(/\/+$/, '').toLowerCase();
            return normalizedSocialUrl === normalizedContributorUrl;
          });

          if (matchingSocial) {
            const matchingProfile = profilesData.find(profile => profile.id === matchingSocial.user_id);
            if (matchingProfile) {
              contributorsWithSocials.push({
                icon: matchingSocial.icon,
                url: matchingSocial.username,
                color: matchingProfile.color,
                avatar: matchingProfile.avatar,
                background_color: matchingProfile.background_color
              });
            }
          }
        }

        setFilteredContributors(contributorsWithSocials);
        console.log('Filtered contributors with socials:', contributorsWithSocials); // Log filtered contributors
      } catch (error) {
        console.error('Error in fetchSocialsAndProfiles:', error);
      }
    };

    if (contributors.length > 0) {
      fetchSocialsAndProfiles();
    }
  }, [contributors, supabase]);

  return (
    <div>
      <ul className="flex flex-col">
        {filteredContributors.length > 0 ? (
          filteredContributors.map((contributor, index) => (
            <li key={index} className="flex items-center mb-2">
              <a href={contributor.url} className="ml-2" style={{ color: contributor.color }}>
                <img src={contributor.avatar} alt={contributor.url} className="w-8 h-8 rounded-full" />
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
