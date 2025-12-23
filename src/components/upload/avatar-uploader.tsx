
import React, { useRef } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/material';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const Input = styled('input')({
  display: 'none',
});

interface AvatarUploadProps {
  avatarUrl: string;
  onImageChange: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <label htmlFor="icon-button-file">
            <Input 
              accept="image/*" 
              id="icon-button-file" 
              type="file" 
              onChange={handleFileChange}
            />
            <IconButton 
              color="primary" 
              aria-label="upload picture" 
              component="span"
              sx={{ 
                bgcolor: 'white', 
                boxShadow: 2,
                '&:hover': { bgcolor: '#f5f5f5' } 
              }}
            >
              <PhotoCamera />
            </IconButton>
          </label>
        }
      >
        <Avatar
          src={avatarUrl}
          sx={{ width: 128, height: 128, boxShadow: 3, border: '4px solid white' }}
        />
      </Badge>
      
      <Box textAlign="center">
        <Typography variant="caption" color="text.secondary" display="block">
          JPG, GIF or PNG. Max size 800K
        </Typography>
      </Box>
    </Box>
  );
};
