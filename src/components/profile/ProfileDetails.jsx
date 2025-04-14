import {HorizontalContainer, ProfileContainer, VerticalContainer} from "../../tamagui.config.ts";
import {H2, H4, Separator, SizableText} from "tamagui";
import React from "react";

const ProfileDetails = ({user, store}) => {
    return (
            <VerticalContainer>
                <H2>Profile details</H2>
                <ProfileContainer>
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Username</H4>
                        <SizableText>{user?.name}</SizableText>
                    </HorizontalContainer>
                    <Separator />
                    <HorizontalContainer
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <H4>Email</H4>
                        <SizableText>{user?.email}</SizableText>
                    </HorizontalContainer>
                    {store && <>
                        <Separator />
                        <VerticalContainer>
                            <H4>Privileges</H4>
                            {!user.is_admin && !user.is_buyer && !user.is_seller && <SizableText>None</SizableText>}
                            <SizableText>{user.is_admin ? 'Admin' : ''}</SizableText>
                            <SizableText>{user.is_buyer ? 'Buyer' : ''}</SizableText>
                            <SizableText>{user.is_seller ? 'Seller' : ''}</SizableText>
                        </VerticalContainer>
                    </>
                    }
                    <SizableText alignSelf="center">Register date: {user?.created_at.slice(0,10)}</SizableText>
                </ProfileContainer>
            </VerticalContainer>
    )
}

export default React.memo(ProfileDetails);