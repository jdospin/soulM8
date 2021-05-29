using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers {
  public class AutoMapperProfiles : Profile
  {
    public AutoMapperProfiles()
    {
      // Here we obtain the photo marked as the main photo from the appUser object to be sent 
      // to the DTO and copied into the PhotoUrl field
      CreateMap<AppUser, MemberDto>()
        .ForMember(destinationMember => 
          destinationMember.PhotoUrl, memberOptions => 
            memberOptions.MapFrom(sourceMember => 
              sourceMember.Photos.FirstOrDefault(x => x.IsMain).Url))
        .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
      CreateMap<Photo, PhotoDto>();
    }
  }
}
