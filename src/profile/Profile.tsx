import './Profile.css'
import React, { useEffect, useState} from "react";
import {Backend} from "../backend/backend";
import useSummaryContext from "../summary/useSummaryContext";
import {SummaryContextData} from "../summary/SummaryContext";
import {ErrorElement} from "../error/ErrorElement";
import {handleAsyncError} from "../error/Errors";

export interface ProfileData {
    id: string,
    name: string
}

export type CreateProfileData = Omit<ProfileData, 'id'>

type ProfileElementProp = {
    profile: ProfileData
    deleteProfile: (id: string) => void
}

// REQUIREMENT: Navigate to tasks associated with a particular profile
const ProfileElement = ({ profile, deleteProfile }: ProfileElementProp): React.ReactElement => {
    const onClickDelete = (): void => deleteProfile(profile.id)
    return (
        <li>
            <label htmlFor={profile.id}>
                <a href={`/task/${profile.id}`}>{profile.name}</a>
            </label>
            <button onClick={onClickDelete}>delete</button>
        </li>
    )
}

type ProfileListProps = {
    profiles: Array<ProfileData>,
    deleteProfile: (id: string) => void
}

// REQUIREMENT: Display all profiles
const ProfileList = ({ profiles, deleteProfile}: ProfileListProps) => {
    const profilesElements = profiles.map(profile =>
        <ProfileElement key={profile.id} profile={profile} deleteProfile={deleteProfile}/>
    )

    return (
        <ol className={'elements'}>
            {profilesElements}
        </ol>
    )
}

type AddProfileProps = {
    backend: Backend
    updateSummary: () => Promise<void>
    loadProfiles: () => Promise<void>
}

// REQUIREMENT: Add a profile and have page refresh
const AddProfile = ({backend, updateSummary, loadProfiles}: AddProfileProps) => {
    const [newProfileName, setNewProfileName] = useState('')

    const onKeyUp = async (event: React.KeyboardEvent): Promise<void> => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
        const pressedEnter: boolean = event.key === 'Enter'
        const nonEmptyProfileName: boolean = newProfileName !== ''
        if ( pressedEnter && nonEmptyProfileName) {
            await backend.addProfile(newProfileName)
            await updateSummary()
            setNewProfileName('')
            await loadProfiles()
        }
    }

    // need generic typing on change event
    const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newName: string = event.target.value
        setNewProfileName(newName)
    }

    return <input type={'text'}
                  value={newProfileName}
                  placeholder="Add new profile here"
                  onKeyUp={onKeyUp}
                  onChange={onChange}/>
}

type ProfileProp = {
    backend: Backend
}

export const Profile = ({ backend }: ProfileProp) => {
    const summaryContext: SummaryContextData = useSummaryContext()
    const [error, setError] = useState<Error | undefined>(undefined)
    const [profiles, setProfiles] = useState<ProfileData[]>([])

    const updateSummary = async () => handleAsyncError(setError, async () => {
        await summaryContext.updateSummary()
    })

    const loadProfiles = async () => handleAsyncError(setError, async () => {
        const profilesLoaded: Array<ProfileData> = await backend.getProfiles()
        setProfiles(profilesLoaded)
    })

    // REQUIREMENT: Remove a profile and have page refresh
    const deleteProfile = async (profileId: string) => handleAsyncError(setError, async () => {
        await backend.deleteProfileAndAssociatedTasks(profileId)
        await updateSummary()
        await loadProfiles()
    })

    useEffect(() => {
        loadProfiles()
    },[])

    return <div className={'Profile'}>
        <h1>Profiles</h1>
        <ErrorElement error={error}/>
        <ProfileList profiles={profiles} deleteProfile={deleteProfile}/>
        <AddProfile backend={backend} updateSummary={updateSummary} loadProfiles={loadProfiles}/>
    </div>
}