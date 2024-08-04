'use client'
import { SubmitButton } from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
//import * as React from 'react'
import { getGroup } from '@/lib/api'
import { GroupFormValues, groupFormSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import defaultParticipants from "./defaultParticipants.json"

function Separator({ color = "green", height = 1 }) {
  return (
    <hr
      style={{
        backgroundColor: color,
        height: height,
        border: "none"
      }}
    />
  );
}

export type Props = {
  group?: NonNullable<Awaited<ReturnType<typeof getGroup>>>
  onSubmit: (
    groupFormValues: GroupFormValues,
    participantId?: string,
  ) => Promise<void>
  protectedParticipantIds?: string[]
}

export function GroupForm({
  group,
  onSubmit,
  protectedParticipantIds = [],
}: Props) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: group
      ? {
          name: group.name,
          currency: group.currency,
          participants: group.participants,
        }
      : {
          name: '',
          currency: '',
          // participants: [{ name: 'Adam G.', venmo: 'Adam-Goad-1' }, { name: 'Adam N.', venmo: 'Adam-Naumann' }, { name: 'Alec', venmo: 'Alec-Turung' }, { name: 'Ben', venmo: 'Benjamin-Adkins' }, { name: 'Bradley', venmo: 'Bradley-Nelson-22' }, { name: 'Brian', venmo: 'Brian-Thayil' }, { name: 'Jack', venmo: 'Jack-Huigens' }, { name: 'Katie K.', venmo: 'ktkasky' }, { name: 'Katie S.', venmo: 'Katie_Stiles' }, { name: 'Lauren', venmo: 'LaurenSpindler' }, { name: 'Matt', venmo: 'Matthew-White-22351'}, {name: 'Ryan R.', venmo: 'RyanRippy'}, { name: 'Ryan S.', venmo: 'Ryndler' }, { name: 'Sam', venmo: 'Samuel-Hnatek' }, { name: 'Summer', venmo: 'Summer-Steinhilber'}],
          participants: defaultParticipants,
        },
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'participants',
    keyName: 'key',
  })

  const [activeUser, setActiveUser] = useState<string | null>(null)
  useEffect(() => {
    if (activeUser === null) {
      const currentActiveUser =
        fields.find(
          (f) => f.id === localStorage.getItem(`${group?.id}-activeUser`),
        )?.name || 'None'
      setActiveUser(currentActiveUser)
    }
  }, [activeUser, fields, group?.id])

  const updateActiveUser = () => {
    if (!activeUser) return
    if (group?.id) {
      const participant = group.participants.find((p) => p.name === activeUser)
      if (participant?.id) {
        localStorage.setItem(`${group.id}-activeUser`, participant.id)
      } else {
        localStorage.setItem(`${group.id}-activeUser`, activeUser)
      }
    } else {
      localStorage.setItem('newGroup-activeUser', activeUser)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(
            values,
            group?.participants.find((p) => p.name === activeUser)?.id ??
              undefined,
          )
        })}
      >
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Group information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="Summer vacations"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a name for your group.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency symbol</FormLabel>
                  <FormControl>
                    <Input
                      className="text-base"
                      placeholder="$, €, £…"
                      max={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We’ll use it to display amounts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>
              Enter the name for each participant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {fields.map((item, index) => (
                <li key={item.key} className="flex-row"> 
                <FormField
                    control={form.control}
                    name={`participants.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Participant Name
                        </FormLabel>
                        <FormControl>
                          <div className="flex-row gap-2">
                            <Input className="text-base" {...field} />                           
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`participants.${index}.venmo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >
                          Venmo Username
                        </FormLabel>
                        <FormControl>
                          <div className="flex-row gap-2">
                            <Input className="text-base" {...field} />
                            {item.id &&
                            protectedParticipantIds.includes(item.id) ? (
                              <HoverCard>
                                <HoverCardTrigger>
                                  <Button
                                    variant="ghost"
                                    className="text-destructive-"
                                    type="button"
                                    size="icon"
                                    disabled
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive opacity-50" />
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent
                                  align="end"
                                  className="text-sm"
                                >
                                  This participant is part of expenses, and can
                                  not be removed.
                                </HoverCardContent>
                              </HoverCard>
                            ) : (
                              <Button
                                variant="ghost"
                                className="text-destructive"
                                onClick={() => remove(index)}
                                type="button"
                                size="icon"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator color="green" />
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="secondary"
              onClick={() => {
                append({ name: 'New', venmo: '' })
              }}
              type="button"
            >
              Add participant
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Local settings</CardTitle>
            <CardDescription>
              These settings are set per-device, and are used to customize your
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {activeUser !== null && (
                <FormItem>
                  <FormLabel>Active user</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setActiveUser(value)
                      }}
                      defaultValue={activeUser}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {[{ name: 'None' }, ...form.watch('participants')]
                          .filter((item) => item.name.length > 0)
                          .map(({ name }) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    User used as default for paying expenses.
                  </FormDescription>
                </FormItem>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex mt-4 gap-2">
          <SubmitButton
            loadingContent={group ? 'Saving…' : 'Creating…'}
            onClick={updateActiveUser}
          >
            <Save className="w-4 h-4 mr-2" /> {group ? <>Save</> : <> Create</>}
          </SubmitButton>
          {!group && (
            <Button variant="ghost" asChild>
              <Link href="/groups">Cancel</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
