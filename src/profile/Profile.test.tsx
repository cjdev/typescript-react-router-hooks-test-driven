
import {Profile, ProfileData} from "./Profile";
import {createSampleData} from "../test/sampleData";
import {TaskData} from "../task/Task";
import {createProfilePageTester, PageTester} from "../test/setupTester";

describe('REQUIREMENT: Display all profiles', () => {

    test("render single profile", async () => {
        // given
        const sample = createSampleData()
        const profilesData: Array<ProfileData> = [sample.profile()]
        const tasks: Array<TaskData> = []

        // when
        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.rendered.container.firstChild).toHaveClass('Profile')
        expect(tester.rendered.getByText(profilesData[0].name)).toBeInTheDocument()
    })

    test("render multiple profiles", async () => {
        // given
        const sample = createSampleData()

        const profilesData: Array<ProfileData> = sample.profileArray(2)

        const tasks: Array<TaskData> = []

        // when
        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.rendered.container.firstChild).toHaveClass('Profile')
        expect(tester.rendered.getByText(profilesData[0].name)).toBeInTheDocument()
        expect(tester.rendered.getByText(profilesData[1].name)).toBeInTheDocument()
    })

})

describe('REQUIREMENT: Add a profile and have page refresh', () => {

    test('add profile on press enter', async () => {
        // given
        const sample = createSampleData()
        const initialProfile = sample.profile()
        const profilesData: Array<ProfileData> = [ initialProfile ]
        const tasks: Array<TaskData> = []

        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableProfilesData().length).toEqual(1)
        expect(tester.rendered.getByText(initialProfile.name)).toBeInTheDocument()

        // when
        const profile = sample.profile()
        await tester.typeProfileName(profile.name)
        await tester.pressKeyOnProfileInput('Enter')

        // then
        expect(tester.inMemoryBackend.getMutableProfilesData().length).toEqual(2)
        expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()
    })

    test('do not add profile with blank name', async () => {
        // given
        const sample = createSampleData()

        const profilesData: Array<ProfileData> = []
        const tasks: Array<TaskData> = []

        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // when
        await tester.pressKeyOnProfileInput('Enter')

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableProfilesData().length).toEqual(0)
    })

    test('do not add profile if key pressed is not Enter', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile()
        const profilesData: Array<ProfileData> = []

        const tasks: Array<TaskData> = []

        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // when
        await tester.typeProfileName(profile.name)
        await tester.pressKeyOnProfileInput('z')

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableProfilesData().length).toEqual(0)
    })

})

describe('REQUIREMENT: Remove a profile and have page refresh', () => {

    test('delete profile', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile()
        const profilesData: Array<ProfileData> = [profile]

        const task = sample.task({maybeProfileId: profile.id})
        const tasks: Array<TaskData> = [task]

        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        // when
        await tester.clickDeleteProfileButton(profile.name)

        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableProfilesData().length).toEqual(0)
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(0)
    })
})

describe('REQUIREMENT: Navigate to tasks associated with a particular profile', () => {

    test('navigate to profile', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile()
        const profilesData: Array<ProfileData> = [profile]

        const task = sample.task({maybeProfileId: profile.id})
        const tasks: Array<TaskData> = [task]

        const tester: PageTester = await createProfilePageTester({ profilesData, tasks, sample })

        const hrefValue = `/task/${profile.id}`
        // then
        expect(tester.rendered.getByText('Profiles')).toBeInTheDocument()
        expect(tester.rendered.getByText(profile.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(profile.name)).toHaveAttribute('href', hrefValue)

    })

})




